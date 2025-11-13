
import React, { useState, useEffect, useMemo } from 'react';
import { getAdminStats, getAllUsers, getAllRiders, getAllOrders } from '../services/mockApi';
import { User, Rider, Order, Role } from '../types';
import StatCard from '../components/StatCard';
import { Users, Bike, Package, DollarSign } from 'lucide-react';
import { THEME_COLORS } from '../constants';
import Spinner from '../components/ui/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';

const Table: React.FC<{ columns: string[]; data: any[]; title: string }> = ({ columns, data, title }) => (
  <Card>
    <h3 className="text-xl font-bold text-secondary mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map(col => <th key={col} scope="col" className="px-6 py-3">{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              {columns.map(col => <td key={col} className="px-6 py-4">{item[col.toLowerCase().replace(' ', '')]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalRiders: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, ridersData, ordersData] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllRiders(),
          getAllOrders()
        ]);
        setStats(statsData);
        setUsers(usersData);
        setRiders(ridersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const dailyData: { [key: string]: { deliveries: number; revenue: number } } = {};
    orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if(!dailyData[date]) {
            dailyData[date] = { deliveries: 0, revenue: 0 };
        }
        dailyData[date].deliveries++;
        dailyData[date].revenue += order.fare;
    });
    return Object.entries(dailyData).map(([name, values]) => ({ name, ...values }));
  }, [orders]);

  if (loading) return <Spinner size="lg" />;

  const userDataForTable = users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone }));
  const riderDataForTable = riders.map(r => ({ id: r.id, name: r.name, email: r.email, deliveries: r.totalDeliveries, status: r.activeStatus }));
  const orderDataForTable = orders.map(o => ({ id: o.id.substring(0,8), status: o.status, fare: `$${o.fare.toFixed(2)}`, customer: o.user?.name, rider: o.rider?.name || 'N/A' }));

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-secondary">Admin Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} color={THEME_COLORS.secondary} />
        <StatCard icon={<Bike />} title="Total Riders" value={stats.totalRiders} color={THEME_COLORS.primary} />
        <StatCard icon={<Package />} title="Total Orders" value={stats.totalOrders} color="#34D399" />
        <StatCard icon={<DollarSign />} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="#60A5FA" />
      </div>

      {/* Chart */}
      <Card>
          <h3 className="text-xl font-bold text-secondary mb-4">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deliveries" fill={THEME_COLORS.primary} name="Deliveries" />
                  <Bar dataKey="revenue" fill={THEME_COLORS.secondary} name="Revenue ($)" />
              </BarChart>
          </ResponsiveContainer>
      </Card>

      {/* Tables */}
      <div className="space-y-8">
        <Table title="All Orders" columns={['ID', 'Status', 'Fare', 'Customer', 'Rider']} data={orderDataForTable} />
        <Table title="Customers" columns={['ID', 'Name', 'Email', 'Phone']} data={userDataForTable} />
        <Table title="Riders" columns={['ID', 'Name', 'Email', 'Deliveries', 'Status']} data={riderDataForTable} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
