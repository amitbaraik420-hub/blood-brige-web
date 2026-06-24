'use client';
import React from 'react'
import Navbar from '../navbar/page' 
import HeroBanner from '../components/HeroBanner'
import GettingStarted from '../GettingStarted/page'
import Footer from '../components/Footer'
import { AuthProvider } from '@/context/AuthContext' 
export default function MainLayout({ children }) {
  return (
    <div>
     
      <AuthProvider>
      
        <Navbar />
        
     
        <HeroBanner />
        <GettingStarted />
        
     
        <main className="min-h-screen">
          {children}
        </main>
        
       
        <Footer />    
      </AuthProvider>
    </div>
  )
}