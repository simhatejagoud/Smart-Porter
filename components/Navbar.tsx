
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { ICONS } from '../constants';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case Role.USER:
        return '/dashboard';
      case Role.RIDER:
        return '/rider/dashboard';
      case Role.ADMIN:
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            {ICONS.delivery}
            <span className="text-2xl font-bold text-secondary">Smart Porter</span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={getDashboardPath()} className="text-gray-600 hover:text-primary font-medium">Dashboard</Link>
                <span className="text-gray-500">|</span>
                <span className="font-medium text-gray-700">Hi, {user.name.split(' ')[0]}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium flex items-center gap-1">
                  {ICONS.login} Login
                </Link>
                <Button onClick={() => navigate('/register')} size="sm">
                  Become a Porter
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
