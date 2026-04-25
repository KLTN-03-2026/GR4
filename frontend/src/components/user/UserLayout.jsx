import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function UserLayout({ children }) {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <div className={`${isProfilePage ? 'lg:ml-80' : 'ml-0'} transition-all duration-500`}>
        <Footer />
      </div>
    </div>
  );
}
