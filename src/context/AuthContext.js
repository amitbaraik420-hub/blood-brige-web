'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔄 পেজ লোড হলে ইউজারের প্রোফাইল ডাটা ব্যাকএন্ড থেকে আনা
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // এখানে আপনার ব্যাকএন্ডের প্রোফাইল বা 'me' এপিআই কল হবে
      const res = await fetch('http://localhost:8000/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // ব্যাকএন্ড থেকে আসা ইউজার অবজেক্ট সেট হবে
      } else {
        // টোকেন ইনভ্যালিড হলে রিমুভ করে দেওয়া
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 🚪 লগআউট ফাংশন (গ্লোবাল)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}