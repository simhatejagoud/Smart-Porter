import { User, Rider, Order, Role, OrderStatus } from '../types';

// --- MOCK DATABASE ---
// In a real app, this would be a real database. We use localStorage to persist data across sessions.

// Helper to get/set data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};


// --- SEED DATA ---
export const MOCK_USERS_DB: User[] = [
  { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', role: Role.USER, createdAt: new Date().toISOString() },
  { id: 'user2', name: 'Bob Williams', email: 'bob@example.com', phone: '123-456-7891', role: Role.USER, createdAt: new Date().toISOString() },
];

export const MOCK_RIDERS_DB: Rider[] = [
  { id: 'rider1', name: 'Charlie Brown', email: 'charlie@example.com', phone: '234-567-8901', role: Role.RIDER, createdAt: new Date().toISOString(), activeStatus: 'online', currentLocation: { lat: 34.05, lng: -118.25 }, totalDeliveries: 15 },
];

export const MOCK_ADMINS_DB: User[] = [
    { id: 'admin1', name: 'Admin Eve', email: 'admin@example.com', phone: '345-678-9012', role: Role.ADMIN, createdAt: new Date().toISOString() },
];

let MOCK_ORDERS_DB: Order[] = [
    { id: 'order1', userId: 'user1', user: MOCK_USERS_DB[0], riderId: 'rider1', rider: MOCK_RIDERS_DB[0], pickupAddress: '100 Art Museum Dr, Los Angeles', dropAddress: '200 Santa Monica Pier, Santa Monica', itemDescription: 'A valuable painting.', itemImage: undefined, status: OrderStatus.DELIVERED, fare: 25.50, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'order2', userId: 'user2', user: MOCK_USERS_DB[1], riderId: 'rider1', rider: MOCK_RIDERS_DB[0], pickupAddress: '300 Griffith Observatory Rd, Los Angeles', dropAddress: '400 Hollywood Blvd, Hollywood', itemDescription: 'Telescope parts, handle with care.', itemImage: undefined, status: OrderStatus.PICKED_UP, fare: 18.00, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'order3', userId: 'user1', user: MOCK_USERS_DB[0], riderId: null, rider: undefined, pickupAddress: '500 Grand Park, Los Angeles', dropAddress: '600 Staples Center, Los Angeles', itemDescription: 'Urgent legal documents.', itemImage: undefined, status: OrderStatus.PENDING, fare: 12.75, createdAt: new Date().toISOString() },
];

// --- API FUNCTIONS ---

// AUTH
export const apiLogin = (email: string, password: string): Promise<{ token: string, user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allUsers = [...getFromStorage('users', MOCK_USERS_DB), ...getFromStorage('riders', MOCK_RIDERS_DB), ...getFromStorage('admins', MOCK_ADMINS_DB)];
      const user = allUsers.find(u => u.email === email);
      
      // NOTE: In a real app, you'd check a hashed password.
      if (user) {
        // Simulate successful login
        const token = `mock-token-for-${user.id}`;
        resolve({ token, user });
      } else {
        reject(new Error('Invalid email or password. Try: admin@example.com'));
      }
    }, 500);
  });
};

export const apiRegister = (userData: { name: string, email: string, password: string, phone: string, role: Role }): Promise<{ token: string, user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { name, email, phone, role } = userData;
            const users = getFromStorage('users', MOCK_USERS_DB);
            const riders = getFromStorage('riders', MOCK_RIDERS_DB);
            const allEmails = [...users, ...riders, ...getFromStorage('admins', MOCK_ADMINS_DB)].map(u => u.email);
            
            if(allEmails.includes(email)) {
                return reject(new Error('Email already exists.'));
            }

            const newUser: User | Rider = {
                id: `new_${Date.now()}`,
                name,
                email,
                phone,
                role,
                createdAt: new Date().toISOString(),
                ...(role === Role.RIDER && { activeStatus: 'offline', currentLocation: { lat: 0, lng: 0 }, totalDeliveries: 0 })
            };
            
            if (role === Role.USER) {
                saveToStorage('users', [...users, newUser]);
            } else {
                saveToStorage('riders', [...riders, newUser as Rider]);
            }
            
            const token = `mock-token-for-${newUser.id}`;
            resolve({ token, user: newUser });
        }, 500);
    });
};


// ORDERS
export const createOrder = (orderData: Partial<Order>): Promise<Order> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let orders = getFromStorage('orders', MOCK_ORDERS_DB);
            
            const newOrder: Order = {
                id: `order_${Date.now()}`,
                userId: orderData.userId!,
                riderId: null,
                pickupAddress: orderData.pickupAddress!,
                dropAddress: orderData.dropAddress!,
                itemDescription: orderData.itemDescription!,
                itemImage: orderData.itemImage,
                status: OrderStatus.PENDING,
                fare: orderData.fare!,
                createdAt: new Date().toISOString(),
            };
            
            // Note: The object saved to storage is unpopulated, which is correct for our mock DB.
            orders = [newOrder, ...orders];
            saveToStorage('orders', orders);
            
            // Populate the order before returning it, so the UI updates with consistent data.
            const populatedOrder = populateOrder(newOrder);
            
            resolve(populatedOrder);
        }, 500);
    });
};


const populateOrder = (order: Order): Order => {
    const users = getFromStorage('users', MOCK_USERS_DB);
    const riders = getFromStorage('riders', MOCK_RIDERS_DB);
    return {
        ...order,
        user: users.find(u => u.id === order.userId),
        rider: riders.find(r => r.id === order.riderId)
    };
};

export const getUserOrders = (userId: string): Promise<Order[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage('orders', MOCK_ORDERS_DB);
            const userOrders = orders.filter(o => o.userId === userId).map(populateOrder);
            resolve(userOrders);
        }, 300);
    });
};

export const getRiderOrders = (riderId: string): Promise<Order[]> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage('orders', MOCK_ORDERS_DB);
            const riderOrders = orders.filter(o => o.riderId === riderId).map(populateOrder);
            resolve(riderOrders);
        }, 300);
    });
};

export const getAvailableOrders = (): Promise<Order[]> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage('orders', MOCK_ORDERS_DB);
            const available = orders.filter(o => o.status === OrderStatus.PENDING).map(populateOrder);
            resolve(available);
        }, 300);
    });
};

export const updateOrderStatus = (orderId: string, status: OrderStatus, riderId?: string): Promise<Order> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let orders = getFromStorage('orders', MOCK_ORDERS_DB);
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if(orderIndex === -1) {
                return reject(new Error('Order not found.'));
            }
            
            const updatedOrder = { ...orders[orderIndex], status };
            if (status === OrderStatus.ACCEPTED && riderId) {
                updatedOrder.riderId = riderId;
            }
            orders[orderIndex] = updatedOrder;
            
            if (status === OrderStatus.DELIVERED && updatedOrder.riderId) {
                let riders = getFromStorage('riders', MOCK_RIDERS_DB);
                const riderIndex = riders.findIndex(r => r.id === updatedOrder.riderId);
                if(riderIndex > -1) {
                    riders[riderIndex].totalDeliveries++;
                    saveToStorage('riders', riders);
                }
            }

            saveToStorage('orders', orders);
            resolve(populateOrder(updatedOrder));
        }, 400);
    });
};

// ADMIN
export const getAdminStats = (): Promise<{ totalUsers: number, totalRiders: number, totalOrders: number, totalRevenue: number }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getFromStorage('users', MOCK_USERS_DB);
            const riders = getFromStorage('riders', MOCK_RIDERS_DB);
            const orders = getFromStorage('orders', MOCK_ORDERS_DB);
            const totalRevenue = orders
                .filter(o => o.status === OrderStatus.DELIVERED)
                .reduce((sum, order) => sum + order.fare, 0);
            
            resolve({
                totalUsers: users.length,
                totalRiders: riders.length,
                totalOrders: orders.length,
                totalRevenue
            });
        }, 200);
    });
};

export const getAllUsers = (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(getFromStorage('users', MOCK_USERS_DB)), 100));
}

export const getAllRiders = (): Promise<Rider[]> => {
    return new Promise(resolve => setTimeout(() => resolve(getFromStorage('riders', MOCK_RIDERS_DB)), 100));
}

export const getAllOrders = (): Promise<Order[]> => {
    return new Promise(resolve => setTimeout(() => resolve(getFromStorage('orders', MOCK_ORDERS_DB).map(populateOrder)), 100));
}

// Initialize DBs on first load
const initDb = () => {
    if (!localStorage.getItem('users')) {
        saveToStorage('users', MOCK_USERS_DB);
    }
    if (!localStorage.getItem('riders')) {
        saveToStorage('riders', MOCK_RIDERS_DB);
    }
    if (!localStorage.getItem('admins')) {
        saveToStorage('admins', MOCK_ADMINS_DB);
    }
    if (!localStorage.getItem('orders')) {
        saveToStorage('orders', MOCK_ORDERS_DB);
    }
}

initDb();