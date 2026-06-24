
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Droplet, Clock, MapPin, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // লগইন না থাকলে প্রোটেকশন
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ইউজারের নিজস্ব ব্লাড রিকোয়েস্টগুলো লোড করা
  useEffect(() => {
    if (!user?.email) return;

    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/v1/my-donation-requests', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMyRequests(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user requests:', err);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* 👤 প্রোফাইল সামারি কার্ড */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 mb-8">
          <img
            className="w-24 h-24 rounded-full object-cover border-4 border-rose-100 shadow-sm"
            src={user?.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            alt={user?.name}
          />
          <div className="flex-1 text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-slate-500 text-sm flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4 text-slate-400" /> {user?.email}
            </p>
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="badge bg-rose-50 text-rose-600 border-rose-100 px-3 py-2 font-bold uppercase text-xs">
                Role: {user?.role || 'User'}
              </span>
              {user?.bloodGroup && (
                <span className="badge bg-red-600 text-white border-none px-3 py-2 font-bold text-xs">
                  Blood Group: {user?.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 📊 মাই রিকোয়েস্ট সেকশন */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">My Blood Requests ({myRequests.length})</h2>
            <p className="text-slate-400 text-xs mt-1">আপনার তৈরি করা ইমার্জেন্সি রক্তের পোস্টগুলোর তালিকা ও বর্তমান অবস্থা।</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
            </div>
          ) : myRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full text-slate-700">
                {/* টেবিল হেডার */}
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6">Recipient Name</th>
                    <th className="py-4 px-6">Blood Group</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                {/* টেবিল বডি */}
                <tbody className="divide-y divide-slate-100 text-sm">
                  {myRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800 capitalize">
                        {req.recipientName}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                          <Droplet className="w-3.5 h-3.5 fill-rose-600" />
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6 capitalize">
                        <div className="font-medium text-slate-700">{req.hospitalName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{req.upazila}, {req.district}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {req.donationDate}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {req.donationTime}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          req.deliveryStatus === 'pending' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {req.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <p className="text-slate-400 font-medium">আপনি এখনও কোনো রক্তের অনুরোধ পোস্ট করেননি।</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}