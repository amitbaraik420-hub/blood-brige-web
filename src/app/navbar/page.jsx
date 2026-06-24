'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { MdOutlineDashboard } from 'react-icons/md';
import { CiLogin } from 'react-icons/ci';
import { useAuth } from '@/context/AuthContext'; // 👈 AuthContext ইম্পোর্ট

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Donation Requests', href: '/donation-requests' },
  { name: 'Search Donors', href: '/search-donor' },
  { name: 'Request Blood', href: '/request-blood' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); 

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white px-4 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-slate-800">Life<span className="text-rose-600">Drop</span></span>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white">🩸</span>
          <span className="text-xl font-bold text-slate-800">
            Life<span className="text-rose-600">Drop</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-rose-600">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            /* 🔴 লগইন না থাকলে */
            <Link
              href="/login"
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Login
            </Link>
          ) : (
            /* 🟢 লগইন থাকলে ডাইনামিক ডাটা */
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt={user?.name || "User"}
                    src={user?.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white border border-slate-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg text-slate-700"
              >
                <li>
                  <Link href="/profile" className="justify-between">
                    {user?.name || 'Donor'}
                    <span className="badge badge-secondary text-xs truncate max-w-[100px]">{user?.email}</span>
                  </Link>
                </li>
                <li><Link href="/dashboard"><MdOutlineDashboard /> Dashboard</Link></li>
                <li>
                  <button onClick={logout} className="text-rose-600 w-full text-left">
                    <CiLogin /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="space-y-4 border-t border-rose-100 bg-white px-4 py-4 md:hidden">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block font-medium text-slate-700 hover:text-rose-600"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <hr className="border-rose-50" />

          <div className="pt-1">
            {user ? (
              /* 🟢 মোবাইল মোডে লগইন থাকলে */
              <div className="dropdown dropdown-end w-full">
                <div tabIndex={0} role="button" className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt={user?.name}
                        src={user?.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white border border-slate-100 rounded-box z-[1] mt-2 w-full p-2 shadow-md text-slate-700"
                >
                  <li><Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
                  <li><Link href="/dashboard" onClick={() => setIsOpen(false)}><MdOutlineDashboard /> Dashboard</Link></li>
                  <li>
                    <button onClick={logout} className="text-rose-600 w-full text-left">
                      <CiLogin /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* 🔴 মোবাইল মোডে লগইন না থাকলে */
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}