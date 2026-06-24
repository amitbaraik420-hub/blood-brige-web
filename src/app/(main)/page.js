'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Hospital, User, Droplet } from 'lucide-react';

export default function HomePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/donation-requests')
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
       
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">
            Saves Lives, <span className="text-rose-600">Donate Blood</span>
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
            আপনার রক্তদানের একটি সিদ্ধান্ত বাঁচাতে পারে একটি মূল্যবান প্রাণ। নিচে ইমার্জেন্সি রক্তের অনুরোধগুলো দেখে বাড়িয়ে দিন সাহায্যের হাত।
          </p>
        </div>

        
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <span className="inline-block h-4 w-1 bg-rose-600 rounded-full"></span>
            Urgent Blood Requests ({requests.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  
                  
                  <div className="absolute top-0 right-0 bg-rose-50 text-rose-600 font-black text-xl px-4 py-2 rounded-bl-2xl border-l border-b border-rose-100 flex items-center gap-1">
                    <Droplet className="w-5 h-5 fill-rose-600 animate-pulse" />
                    {request.bloodGroup}
                  </div>

                  <div>
                 
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 capitalize leading-tight pr-12">
                        Patient: {request.recipientName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Posted by: {request.requesterName}
                      </p>
                    </div>

                   
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <Hospital className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="font-medium text-slate-700">{request.hospitalName}</span>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="capitalize">{request.upazila}, {request.district}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-50 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          {request.donationDate}
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                          {request.donationTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => alert(`Contact Email: ${request.requesterEmail}`)}
                      className="w-full btn btn-sm bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl font-semibold transition-colors"
                    >
                      Donate Now / Contact
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white py-16 px-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 font-medium text-lg">এই মুহূর্তে কোনো রক্তের অনুরোধ নেই।</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}