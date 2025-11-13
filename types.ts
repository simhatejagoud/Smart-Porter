
export enum Role {
  USER = 'user',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PICKED_UP = 'Picked Up',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface Rider extends User {
  activeStatus: 'online' | 'offline';
  currentLocation: { lat: number; lng: number };
  totalDeliveries: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User; // populated
  riderId: string | null;
  rider?: Rider; // populated
  pickupAddress: string;
  dropAddress: string;
  itemDescription: string;
  itemImage?: string; // base64 image data
  status: OrderStatus;
  fare: number;
  createdAt: string;
}
