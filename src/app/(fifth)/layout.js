import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; // 🟢 প্রোভাইডার ইম্পোর্ট করুন


export default function SecondLayout({ children }) {
  return (
    // 🟢 পুরো লেআউটকে AuthProvider দিয়ে ঘিরে দিন
    <AuthProvider>
      <div>
       
        {children}
       
      </div>
    </AuthProvider>
  );
}