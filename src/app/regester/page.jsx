
'use client';

import { useState, useEffect } from 'react';
import { authClient } from "@/app/lib/auth-client";
import { FiUser, FiMail, FiLock, FiPhone, FiCamera, FiMapPin, FiDroplet } from 'react-icons/fi';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    bloodGroup: '',
    district: '',
    upazila: '',
    password: '',
    confirmPassword: '',
    image: null
  });
  
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  // ১. MongoDB থেকে ডিস্ট্রিক্ট লোড করা
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/districts')
      .then(res => res.json())
      .then(data => setDistricts(data))
      .catch(err => console.error("Error loading districts:", err));
  }, []);

  // ২. জেলা সিলেক্ট করলে উপজেলা লোড করা
  useEffect(() => {
    if (formData.district) {
      fetch(`http://localhost:8000/api/v1/upazilas?districtId=${formData.district}`)
        .then(res => res.json())
        .then(data => setUpazilas(data));
    }
  }, [formData.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Password and Confirm Password do not match!");
    }

    let imageUrl = "";

    // ৩. ImageBB তে ইমেজ আপলোড
    if (formData.image) {
      const imageData = new FormData();
      imageData.append("image", formData.image);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`, {
        method: "POST",
        body: imageData
      });
      const imgRes = await res.json();
      imageUrl = imgRes.data.url;
    }

    // ৪. Better Auth এ সাইনআপ
    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      // আপনার সার্ভারে যদি এক্সট্রা ফিল্ডের সাপোর্ট থাকে তবে এখানে পাঠাবেন
    });

    if (error) alert(error.message);
    else alert("Registration Successful!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Join as a Donor</h1>
        
        {/* Image Upload */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer bg-gray-100 p-4 rounded-full border border-dashed border-gray-300 hover:bg-gray-200">
            {formData.image ? (
              <img src={URL.createObjectURL(formData.image)} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <FiCamera size={24} className="text-gray-500" />
            )}
            <input type="file" className="hidden" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Full Name" name="name" icon={<FiUser />} onChange={handleInputChange} />
          <InputGroup label="Email" name="email" type="email" icon={<FiMail />} onChange={handleInputChange} />
          <InputGroup label="Phone" name="phone" icon={<FiPhone />} onChange={handleInputChange} />
          
          <SelectGroup label="Blood Group" name="bloodGroup" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} onChange={handleInputChange} />
          
          {/* Dynamic District */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">DISTRICT</label>
            <select name="district" onChange={handleInputChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select District</option>
              {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name}</option>)}
            </select>
          </div>

          {/* Dynamic Upazila */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">UPAZILA</label>
            <select name="upazila" onChange={handleInputChange} disabled={!formData.district} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Select Upazila</option>
              {upazilas.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
            </select>
          </div>

          <InputGroup label="Password" name="password" type="password" icon={<FiLock />} onChange={handleInputChange} />
          <InputGroup label="Confirm Password" name="confirmPassword" type="password" icon={<FiLock />} onChange={handleInputChange} />
        </div>

        <button type="submit" className="w-full mt-6 bg-red-700 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition">
          Complete Registration
        </button>
      </form>
    </div>
  );
}

// Helper Components
function InputGroup({ label, name, icon, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
      <div className="flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-red-500">
        <span className="text-gray-400 mr-2">{icon}</span>
        <input name={name} type={type} onChange={onChange} className="w-full outline-none text-sm" required />
      </div>
    </div>
  );
}

function SelectGroup({ label, name, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
      <select name={name} onChange={onChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-red-500 text-sm" required>
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}