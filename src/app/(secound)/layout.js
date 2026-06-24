import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; 
import Footer from '../components/Footer';
import Navbar from '../navbar/page';

export default function SecondLayout({ children }) {
  return (
   
    <AuthProvider>
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    </AuthProvider>
  );
}