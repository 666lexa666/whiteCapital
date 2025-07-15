import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { SupportWidget } from './SupportWidget';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <SupportWidget />
    </div>
  );
};