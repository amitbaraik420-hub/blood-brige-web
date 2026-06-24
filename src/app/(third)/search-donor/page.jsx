'use client';

import React, { useState, useEffect } from 'react';

export default function SearchDonorPage() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

 
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


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

   
    const selectedDistrictObj = districts.find(d => d.district_id === district);
    const districtName = selectedDistrictObj ? selectedDistrictObj.name : '';

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}&district=${districtName}&upazila=${upazila}`
      );
      const data = await res.json();
      setDonors(data);
    } catch (error) {
      console.error('Error searching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">
          Find a <span className="text-rose-600">Blood Donor</span>
        </h1>

   
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-10">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl"
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">District</label>
            <select
              value={district}
              onChange={(e) => { setDistrict(e.target.value); setUpazila(''); }}
              className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl"
              required
            >
              <option value="">Select District</option>
              {districts.map((d, index) => (
               
                <option key={`district-${d.id}-${index}`} value={d.district_id}>
                  {d.bn_name} ({d.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Upazila</label>
            <select
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              className="select select-bordered w-full bg-slate-50 border-slate-200 focus:border-rose-500 rounded-xl"
              disabled={!district}
              required
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u, index) => (
               
                <option key={`upazila-${u.id}-${index}`} value={u.name}>
                  {u.bn_name} ({u.name})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn bg-rose-600 hover:bg-rose-700 text-white font-semibold border-none rounded-xl w-full h-[3rem]"
          >
            {loading ? 'Searching...' : 'Search Donors'}
          </button>
        </form>

        
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-4">Search Results ({donors.length})</h2>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
            </div>
          ) : donors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div key={donor._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <img
                    className="w-16 h-16 rounded-full object-cover border-2 border-rose-100"
                    src={donor.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                    alt={donor.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{donor.name}</h3>
                    <p className="text-xs font-semibold text-rose-600 uppercase mt-0.5">Blood Group: {donor.bloodGroup}</p>
                    <p className="text-sm text-slate-500 mt-1 capitalize">{donor.upazila}, {donor.district}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white py-12 px-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 font-medium">No donors found for the selected area or blood group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}