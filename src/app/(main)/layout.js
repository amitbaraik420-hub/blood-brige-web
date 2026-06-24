'use client';
import React from 'react'
import Navbar from '../navbar/page' // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ ঠিক রাখা হয়েছে
import HeroBanner from '../components/HeroBanner'
import GettingStarted from '../GettingStarted/page'
import Footer from '../components/Footer'
import { AuthProvider } from '@/context/AuthContext' // 👈 আমরা যে নতুন AuthContext বানিয়েছি সেটা এখানে ব্যবহার হবে

export default function MainLayout({ children }) {
  return (
    <div>
      {/* 🟢 গ্লোবাল অথ প্রোভাইডার */}
      <AuthProvider>
        {/* 🗺️ নেভিগেশন বার */}
        <Navbar />
        
        {/* 🚀 হোম পেজের কন্টেন্ট */}
        <HeroBanner />
        <GettingStarted />
        
        {/* 📄 অন্যান্য সাব-পেজের কন্টেন্ট (যদি থাকে) */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* 👣 ফুটার */}
        <Footer />    
      </AuthProvider>
    </div>
  )
}