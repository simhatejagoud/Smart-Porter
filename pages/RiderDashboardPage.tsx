
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Order, OrderStatus, Role } from '../types';
import { getAvailableOrders, getRiderOrders, updateOrderStatus } from '../services/mockApi';
import OrderCard from '../components/OrderCard';
import Spinner from '../components/ui/Spinner';

const RiderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    if (user) {
      try {
        // Don't show spinner on auto-refresh
        if(loading){
          setLoading(true);
        }
        const [avail, mine] = await Promise.all([
            getAvailableOrders(),
            getRiderOrders(user.id)
        ]);
        setAvailableOrders(avail.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setMyOrders(mine.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);
  
  const handleAcceptOrder = async (orderId: string) => {
    if (!user) return;
    try {
        await updateOrderStatus(orderId, OrderStatus.ACCEPTED, user.id);
        fetchData();
    } catch(err) {
        setError(err instanceof Error ? err.message : 'Failed to accept order.');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
        await updateOrderStatus(orderId, newStatus, user!.id);
        fetchData();
    } catch(err) {
        setError(err instanceof Error ? err.message : `Failed to update status to ${newStatus}.`);
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }
  
  if (!user) {
    return null;
  }

  const activeOrders = myOrders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED);
  const completedOrders = myOrders.filter(o => o.status === OrderStatus.DELIVERED);

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold text-secondary">Rider Dashboard</h1>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-2xl">{error}</p>}
      
      {/* Active Deliveries */}
      <div>
        <h2 className="text-3xl font-bold text-secondary mb-6">Your Active Deliveries</h2>
        {activeOrders.length === 0 ? (
          <p className="text-gray-500">You have no active deliveries. Accept one below!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} role={Role.RIDER} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        )}
      </div>

      {/* Available Requests */}
      <div>
        <h2 className="text-3xl font-bold text-secondary mb-6">Available Requests Nearby</h2>
         {availableOrders.length === 0 ? (
          <p className="text-gray-500">No available requests at the moment. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableOrders.map(order => (
              <OrderCard key={order.id} order={order} role={Role.RIDER} onAccept={handleAcceptOrder} />
            ))}
          </div>
        )}
      </div>
      
       {/* Completed Deliveries */}
      <div>
        <h2 className="text-3xl font-bold text-secondary mb-6">Completed Deliveries</h2>
        {completedOrders.length === 0 ? (
          <p className="text-gray-500">You have not completed any deliveries yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} role={Role.RIDER} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboardPage;
