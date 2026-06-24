import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; // 🟢 প্রোভাইডার ইম্পোর্ট করুন
import Footer from '../components/Footer';
import Navbar from '../navbar/page';

export default function SecondLayout({ children }) {
  return (
    // 🟢 পুরো লেআউটকে AuthProvider দিয়ে ঘিরে দিন
    <AuthProvider>
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    </AuthProvider>
  );
}