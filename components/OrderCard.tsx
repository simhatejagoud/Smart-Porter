
import React from 'react';
import { Order, OrderStatus, Role } from '../types';
import { MapPin, Package, ArrowRight, User, Bike } from 'lucide-react';
import Card from './ui/Card';

interface OrderCardProps {
  order: Order;
  role: Role;
  onAccept?: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

const statusColors: { [key in OrderStatus]: string } = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PICKED_UP]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, role, onAccept, onUpdateStatus }) => {
  const { id, status, pickupAddress, dropAddress, itemDescription, fare, createdAt, user, rider } = order;

  return (
    <Card className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-secondary text-lg">Order #{id.substring(0, 8)}</h3>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 text-gray-700">
        <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
        <span className="font-medium">{pickupAddress}</span>
        <ArrowRight className="w-5 h-5 text-gray-400" />
        <MapPin className="w-5 h-5 text-secondary-light flex-shrink-0" />
        <span className="font-medium">{dropAddress}</span>
      </div>
      
      <div className="flex items-start space-x-2 text-gray-700 pt-2 border-t">
        <Package className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <p>{itemDescription}</p>
      </div>

      {order.itemImage && (
        <div className="flex justify-center">
            <img src={`data:image/jpeg;base64,${order.itemImage}`} alt="Item" className="max-h-40 rounded-lg shadow-sm" />
        </div>
      )}
      
      <div className="flex justify-between items-end pt-2 border-t">
        <div>
          {user && (role === Role.ADMIN || role === Role.RIDER) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" /> Customer: {user.name}
            </div>
          )}
          {rider && (role === Role.ADMIN || role === Role.USER) && (
             <div className="flex items-center gap-2 text-sm text-gray-600">
              <Bike className="w-4 h-4" /> Porter: {rider.name}
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Fare</p>
          <p className="text-xl font-bold text-primary">${fare.toFixed(2)}</p>
        </div>
      </div>
      
      {role === Role.RIDER && status === OrderStatus.PENDING && onAccept && (
        <button onClick={() => onAccept(id)} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-2xl hover:bg-green-600 transition-colors">
          Accept Delivery
        </button>
      )}

      {role === Role.RIDER && status === OrderStatus.ACCEPTED && onUpdateStatus && (
        <button onClick={() => onUpdateStatus(id, OrderStatus.PICKED_UP)} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-2xl hover:bg-blue-600 transition-colors">
          Mark as Picked Up
        </button>
      )}

      {role === Role.RIDER && status === OrderStatus.PICKED_UP && onUpdateStatus && (
        <button onClick={() => onUpdateStatus(id, OrderStatus.DELIVERED)} className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-2xl hover:bg-indigo-600 transition-colors">
          Mark as Delivered
        </button>
      )}
    </Card>
  );
};

export default OrderCard;
