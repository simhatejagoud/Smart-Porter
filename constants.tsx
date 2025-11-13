
import React from 'react';
import { Truck, User, Shield, BarChart2, Package, Bike, Home, LogIn, UserPlus } from 'lucide-react';

export const ICONS = {
    delivery: <Truck className="w-5 h-5" />,
    user: <User className="w-5 h-5" />,
    admin: <Shield className="w-5 h-5" />,
    dashboard: <BarChart2 className="w-5 h-5" />,
    package: <Package className="w-5 h-5" />,
    rider: <Bike className="w-5 h-5" />,
    home: <Home className="w-5 h-5" />,
    login: <LogIn className="w-5 h-5" />,
    register: <UserPlus className="w-5 h-5" />,
};

export const THEME_COLORS = {
    primary: '#F97316',
    secondary: '#1E3A8A',
};
