
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Smart Porter. All rights reserved.</p>
        <p className="text-sm text-gray-300">Your trusted local delivery partner.</p>
      </div>
    </footer>
  );
};

export default Footer;
