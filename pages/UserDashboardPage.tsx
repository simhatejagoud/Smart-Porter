
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Order, Role } from '../types';
import { getUserOrders } from '../services/mockApi';
import NewDeliveryForm from '../components/NewDeliveryForm';
import OrderCard from '../components/OrderCard';
import Spinner from '../components/ui/Spinner';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);
  
  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-secondary">Welcome, {user.name}!</h1>

      <NewDeliveryForm onOrderCreated={handleOrderCreated} />

      <div>
        <h2 className="text-3xl font-bold text-secondary mb-6">Your Deliveries</h2>
        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-500">You haven't made any deliveries yet. Create one above!</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} role={Role.USER} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
