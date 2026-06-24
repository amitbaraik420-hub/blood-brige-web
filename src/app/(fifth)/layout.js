import React from 'react';
import { AuthProvider } from '@/context/AuthContext'; 


export default function SecondLayout({ children }) {
  return (
   
    <AuthProvider>
      <div>
       
        {children}
       
      </div>
    </AuthProvider>
  );
}