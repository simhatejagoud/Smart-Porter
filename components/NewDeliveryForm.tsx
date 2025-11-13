
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { createOrder } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import MapPreview from './MapPreview';
import ImageAnalyzer from './ImageAnalyzer';

interface NewDeliveryFormProps {
  onOrderCreated: (newOrder: Order) => void;
}

const NewDeliveryForm: React.FC<NewDeliveryFormProps> = ({ onOrderCreated }) => {
  const { user } = useAuth();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageData, setItemImageData] = useState<{base64: string, mimeType: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress || !dropAddress || !itemDescription || !user) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fare calculation logic would be in the backend
      const fare = Math.floor(Math.random() * 20) + 5;
      const newOrderData = {
        userId: user.id,
        pickupAddress,
        dropAddress,
        itemDescription,
        itemImage: itemImageData?.base64,
        status: OrderStatus.PENDING,
        fare,
      };
      const newOrder = await createOrder(newOrderData);
      onOrderCreated(newOrder);
      // Reset form
      setPickupAddress('');
      setDropAddress('');
      setItemDescription('');
      setItemImageData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnalysisComplete = (description: string, imageBase64: string, mimeType: string) => {
    setItemDescription(description);
    setItemImageData({base64: imageBase64, mimeType: mimeType});
  };

  return (
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-secondary mb-6">Create a New Delivery</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input 
            label="Pickup Address" 
            value={pickupAddress} 
            onChange={(e) => setPickupAddress(e.target.value)} 
            placeholder="e.g., 123 Main St, Anytown" 
            required
          />
          <Input 
            label="Drop-off Address" 
            value={dropAddress} 
            onChange={(e) => setDropAddress(e.target.value)} 
            placeholder="e.g., 456 Oak Ave, Otherville" 
            required
          />
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
            <textarea
                id="description"
                rows={4}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="e.g., A box of important documents."
                required
                className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-transparent transition duration-200"
            />
          </div>
          <ImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" isLoading={loading} className="w-full" size="lg">Book Delivery</Button>
        </div>
        <div className="flex flex-col">
          <MapPreview address={dropAddress || pickupAddress} />
          <div className="mt-4 text-sm text-gray-500">
              <h4 className="font-semibold">Estimated Fare:</h4>
              <p>Fare is calculated based on distance and will be confirmed upon booking.</p>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default NewDeliveryForm;
