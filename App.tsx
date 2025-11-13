
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Role } from './types';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UserDashboardPage from './pages/UserDashboardPage';
import RiderDashboardPage from './pages/RiderDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';


function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage isLogin={true} />} />
              <Route path="/register" element={<AuthPage isLogin={false} />} />

              {/* User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[Role.USER]}>
                    <UserDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rider Routes */}
              <Route 
                path="/rider/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[Role.RIDER]}>
                    <RiderDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Chatbot />
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
