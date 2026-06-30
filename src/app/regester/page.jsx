'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiPhone, FiCamera } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    bloodGroup: '',
    district: '', // এখানে ডিস্ট্রিক্টের ID স্টোর হবে
    upazila: '',  // এখানে উপজেলার Name স্টোর হবে
    password: '',
    confirmPassword: '',
    image: null
  });
  
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🟢 ১. ডাটাবেজ (MongoDB) থেকে ডিস্ট্রিক্ট লিস্ট লোড করা
  useEffect(() => {
    fetch('https://server-site-rose.vercel.app/api/v1/districts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch districts');
        return res.json();
      })
      .then(data => {
        setDistricts(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error loading districts:", err);
        setError("Failed to load districts. Please check internet connection or server status.");
      });
  }, []);

  // 🟢 ২. সিলেক্টেড ডিস্ট্রিক্টের ওপর ভিত্তি করে ডাটাবেজ (MongoDB) থেকে উপজেলা লোড করা
  useEffect(() => {
    if (formData.district) {
      // ব্যাকএন্ডের সাথে মিল রেখে districtId কুয়েরি প্যারামিটার পাঠানো হচ্ছে
      fetch(`https://server-site-rose.vercel.app/api/v1/upazilas?districtId=${formData.district}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch upazilas');
          return res.json();
        })
        .then(data => {
          setUpazilas(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("Error loading upazilas:", err);
          setUpazilas([]);
        });
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'district') {
      // ডিস্ট্রিক্ট চেঞ্জ হলে উপজেলা স্টেট রিসেট করতে হবে বাধ্যতামূলক
      setFormData(prev => ({ ...prev, district: value, upazila: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return alert("Password and Confirm Password do not match!");
    }

    setLoading(true);
    // Fallback ডিফল্ট অবতার ইমেজ
    let imageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"; 

    try {
      // 🟢 ৩. ImgBB-তে ইমেজ আপলোড হ্যান্ডেলিং
      if (formData.image) {
        try {
          const imageData = new FormData();
          imageData.append("image", formData.image);
          
          // env ফাইল থেকে কি জোড়া হলো, না থাকলে হার্ডকোড ব্যাকআপ কাজ করবে
          const imgBBKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '7d2a58b90c1f6d34e9e51b689a742cbb'; 
          
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBKey}`, {
            method: "POST",
            body: imageData
          });
          
          const imgRes = await res.json();
          
          if (imgRes.success && imgRes.data && imgRes.data.url) {
            imageUrl = imgRes.data.url;
          } else {
            console.warn("ImgBB Key Invalid, using fallback remote avatar image.");
          }
        } catch (imgErr) {
          console.warn("ImgBB upload error ignored:", imgErr);
        }
      }

      // 🟢 ৪. ডাটাবেজে স্টোর করার আগে নামের ফরম্যাট সার্চ পেজের সাথে মিলানো (যেমন: Dhaka, Sylhet)
      const selectedDistrictObj = districts.find(d => String(d.id) === String(formData.district) || String(d.district_id) === String(formData.district));
      let districtName = selectedDistrictObj ? selectedDistrictObj.name : formData.district;
      if (districtName) {
        districtName = districtName.charAt(0).toUpperCase() + districtName.slice(1).toLowerCase();
      }

      let upazilaName = formData.upazila;
      if (upazilaName) {
        upazilaName = upazilaName.charAt(0).toUpperCase() + upazilaName.slice(1).toLowerCase();
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        district: districtName, 
        upazila: upazilaName,   
        password: formData.password,
        avatar: imageUrl,
        role: 'donor',   // ডিফল্ট রোল এসাইনমেন্ট
        status: 'active' // ডিফল্ট স্ট্যাটাস এসাইনমেন্ট
      };

      console.log("Sending to backend:", userData);

      // 🟢 ৫. ব্যাকএন্ডে রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো
      const backendRes = await fetch('https://server-site-rose.vercel.app/api/v1/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const backendData = await backendRes.json();

      if (backendRes.ok || backendRes.status === 201) {
        if (backendData.token) {
          localStorage.setItem('token', backendData.token);
        }
        alert("Registration Successful!");
        router.push('/'); 
      } else {
        setError(backendData.message || backendData.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Join as a Donor</h1>
        
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium mb-4">{error}</p>}

        {/* ইমেজ সিলেকশন */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer bg-gray-100 p-4 rounded-full border border-dashed border-gray-300 hover:bg-gray-200 flex items-center justify-center w-20 h-20 overflow-hidden">
            {formData.image ? (
              <img src={URL.createObjectURL(formData.image)} className="w-full h-full rounded-full object-cover" alt="Avatar Preview" />
            ) : (
              <FiCamera size={24} className="text-gray-500" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFormData({...formData, image: e.target.files[0] ? e.target.files[0] : null})} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Full Name" name="name" value={formData.name} icon={<FiUser />} onChange={handleInputChange} />
          
          {/* 🔥 এখানে onChange={handleInputChange} যোগ করে এররটি ফিক্স করা হয়েছে */}
          <InputGroup label="Email" name="email" type="email" value={formData.email} icon={<FiMail />} onChange={handleInputChange} />
          
          <InputGroup label="Phone" name="phone" value={formData.phone} icon={<FiPhone />} onChange={handleInputChange} />
          
          <SelectGroup label="Blood Group" name="bloodGroup" value={formData.bloodGroup} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} onChange={handleInputChange} />
          
          {/* 🟢 ডিস্ট্রিক্ট ড্রপডাউন */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">DISTRICT</label>
            <select 
              name="district" 
              value={formData.district} 
              onChange={handleInputChange} 
              required 
              className="w-full border rounded-lg p-2.5 outline-none text-sm focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">Select District</option>
              {districts.map(d => {
                const districtIdValue = d.district_id || d.id;
                return (
                  <option key={d._id || districtIdValue} value={districtIdValue}>
                    {d.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 🟢 উপজেলা ড্রপডাউন */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">UPAZILA</label>
            <select 
              name="upazila" 
              value={formData.upazila} 
              onChange={handleInputChange} 
              disabled={!formData.district} 
              required 
              className="w-full border rounded-lg p-2.5 outline-none text-sm focus:ring-2 focus:ring-red-500 bg-white disabled:bg-gray-100"
            >
              <option value="">Select Upazila</option>
              {upazilas.map(u => {
                const upazilaIdValue = u.upazila_id || u.id || u._id;
                return (
                  <option key={upazilaIdValue} value={u.name}>
                    {u.name}
                  </option>
                );
              })}
            </select>
          </div>

          <InputGroup label="Password" name="password" type="password" value={formData.password} icon={<FiLock />} onChange={handleInputChange} />
          <InputGroup label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} icon={<FiLock />} onChange={handleInputChange} />
        </div>

        <button type="submit" disabled={loading} className="w-full mt-6 bg-red-700 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition disabled:bg-gray-400">
          {loading ? 'Processing Registration...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, name, value, icon, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
      <div className="flex items-center border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-red-500">
        <span className="text-gray-400 mr-2">{icon}</span>
        <input name={name} type={type} value={value} onChange={onChange} className="w-full outline-none text-sm bg-transparent" required />
      </div>
    </div>
  );
}

function SelectGroup({ label, name, value, options, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white" required>
        <option value="">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}