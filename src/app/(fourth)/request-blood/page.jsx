
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RequestBloodPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();


  const [recipientName, setRecipientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [donationDate, setDonationDate] = useState('');
  const [donationTime, setDonationTime] = useState('');

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/districts')
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch((err) => console.error('Error fetching districts:', err));
  }, []);

  useEffect(() => {
    if (!district) {
      setUpazilas([]);
      return;
    }
    fetch(`http://localhost:8000/api/v1/upazilas?districtId=${district}`)
      .then((res) => res.json())
      .then((data) => setUpazilas(data))
      .catch((err) => console.error('Error fetching upazilas:', err));
  }, [district]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

   
    const selectedDistrictObj = districts.find((d) => d.district_id === district);
    const districtName = selectedDistrictObj ? selectedDistrictObj.name : '';

    const requestData = {
      requesterName: user?.name,
      requesterEmail: user?.email,
      recipientName,
      hospitalName,
      fullAddress,
      bloodGroup,
      district: districtName,
      upazila,
      donationDate,
      donationTime,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/v1/donation-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (res.ok) {
        alert('🟢 রক্তের অনুরোধটি সফলভাবে পোস্ট করা হয়েছে!');
      
        setRecipientName('');
        setHospitalName('');
        setFullAddress('');
        setBloodGroup('');
        setDistrict('');
        setUpazila('');
        setDonationDate('');
        setDonationTime('');
        
      
        router.push('/');
      } else {
        const errData = await res.json();
        alert(`❌ সমস্যা হয়েছে: ${errData.message}`);
      }
    } catch (error) {
      console.error('Error creating donation request:', error);
      alert('Can not connect to with server. Please try again later.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Create <span className="text-rose-600">Blood Request</span>
        </h1>
        <p className="text-slate-500 text-center mb-8 text-sm">জরুরি রক্তের প্রয়োজনে নিচে সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Requester Name</label>
              <input type="text" value={user?.name || ''} readOnly className="input input-bordered w-full bg-slate-200 border-slate-300 text-slate-600 font-medium rounded-xl cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Requester Email</label>
              <input type="email" value={user?.email || ''} readOnly className="input input-bordered w-full bg-slate-200 border-slate-300 text-slate-600 font-medium rounded-xl cursor-not-allowed" />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Recipient Name (রোগীর নাম)</label>
              <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Enter patient name" className="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Hospital Name (হাসপাতালের নাম)</label>
              <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. Dhaka Medical College" className="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required />
            </div>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Required Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required>
                <option value="">Select Group</option>
                {bloodGroups.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-2">Full Address (বিস্তারিত ঠিকানা)</label>
              <input type="text" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="e.g. Ward 3, Bed 12, Hospital Road" className="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required />
            </div>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">District (জেলা)</label>
              <select value={district} onChange={(e) => { setDistrict(e.target.value); setUpazila(''); }} className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required>
                <option value="">Select District</option>
                {districts.map((d, index) => (
                  <option key={`req-dist-${d.id}-${index}`} value={d.district_id}>{d.bn_name} ({d.name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Upazila (উপজেলা)</label>
              <select value={upazila} onChange={(e) => setUpazila(e.target.value)} className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" disabled={!district} required>
                <option value="">Select Upazila</option>
                {upazilas.map((u, index) => (
                  <option key={`req-upz-${u.id}-${index}`} value={u.name}>{u.bn_name} ({u.name})</option>
                ))}
              </select>
            </div>
          </div>

       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Donation Date (তারিখ)</label>
              <input type="date" value={donationDate} onChange={(e) => setDonationDate(e.target.value)} className="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Donation Time (সময়)</label>
              <input type="time" value={donationTime} onChange={(e) => setDonationTime(e.target.value)} className="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl" required />
            </div>
          </div>

          
          <div className="pt-4">
            <button type="submit" disabled={submitLoading} className="btn bg-rose-600 hover:bg-rose-700 text-white font-semibold border-none rounded-xl w-full h-[3rem]">
              {submitLoading ? 'Posting Request...' : 'Submit Blood Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}