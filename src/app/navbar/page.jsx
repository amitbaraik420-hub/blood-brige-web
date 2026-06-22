'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { MdOutlineDashboard } from 'react-icons/md';
import { CiLogin } from 'react-icons/ci';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Donation Requests', href: '/donation-requests' },
  { name: 'Search Donors', href: '/search-donor' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  
  const isLoggedIn = true; 

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white">
            🩸
          </span>
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
          {isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
            >
              Login
            </Link>
          ) : (
             
             /* Desktop Avatar Dropdown */
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Profile"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white border border-slate-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg text-slate-700"
              >
                <li>
                  <Link href="/profile" className="justify-between">
                    Doner
                    <span className="badge badge-secondary text-xs">amaj@admin.com</span>
                  </Link>
                </li>
                <li><Link href="/dashboard"><MdOutlineDashboard /> Dashboard</Link></li>
                <li><button className="text-rose-600"><CiLogin /> Logout</button></li>
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

          {/* Mobile Auth Button / Profile Dropdown */}
          <div className="pt-1">
            {isLoggedIn ? (
              /* Mobile Profile Dropdown */
              <div className="dropdown dropdown-end w-full">
                <div tabIndex={0} role="button" className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User Profile"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">My Account</p>
                    <p className="text-xs text-slate-500">Click to view options</p>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white border border-slate-100 rounded-box z-[1] mt-2 w-full p-2 shadow-md text-slate-700"
                >
                  <li>
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="justify-between">
                      Doner  
                      <span className="badge badge-secondary text-xs">amaj@admin.com</span>
                    </Link>
                  </li>
                  <li><Link href="/dashboard" onClick={() => setIsOpen(false)}><MdOutlineDashboard /> Dashboard</Link></li>
                  <li><button className="text-rose-600"><CiLogin /> Logout</button></li>
                </ul>
              </div>
            ) : (
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