'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Mail, Shield, MapPin, Droplet, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // লোডিং স্টেট হ্যান্ডেল করা
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  // ইউজার লগইন না থাকলে লগইন পেজে রিডাইরেক্ট করা
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-md">
        
        {/* প্রোফাইল ব্যানার/হেডার */}
        <div className="relative h-32 bg-gradient-to-r from-rose-500 to-rose-600">
          <div className="absolute -bottom-12 left-8">
            <img
              className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-md"
              src={user?.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={user?.name}
            />
          </div>
        </div>

        {/* প্রোফাইল কন্টেন্ট */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {user?.name}
                <span className={`badge ${user?.status === 'active' ? 'badge-success' : 'badge-error'} text-white text-xs`}>
                  {user?.status || 'Active'}
                </span>
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Shield className="w-4 h-4 text-slate-400" />
                Role: <span className="capitalize font-semibold text-rose-600">{user?.role}</span>
              </p>
            </div>
            
            {/* ব্লাড গ্রুপ ব্যাজ */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 border border-rose-100 w-fit">
              <Droplet className="h-6 w-6 text-rose-600 fill-rose-600 animate-pulse" />
              <div>
                <p className="text-xs text-rose-600 font-medium uppercase">Blood Group</p>
                <p className="text-lg font-bold text-slate-800 leading-none">{user?.bloodGroup || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* ইউজার ডিটেইলস গ্রিড */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* ইমেইল কার্ড */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Email Address</p>
                <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
              </div>
            </div>

            {/* এলাকা/ঠিকানা কার্ড */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Location</p>
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {user?.upazila || 'N/A'}, {user?.district || 'N/A'}
                </p>
              </div>
            </div>

          </div>

          {/* অতিরিক্ত তথ্য বা অ্যাকশন বাটন */}
          <div className="mt-10 flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button 
              onClick={() => alert("Edit Profile Feature Coming Soon!")}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}