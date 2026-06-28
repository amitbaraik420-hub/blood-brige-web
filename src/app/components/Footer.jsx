import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { IoLocationOutline, IoMailOutline, IoCallOutline } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
       
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-lg font-bold">🩸</span>
              <span className="text-2xl font-bold tracking-tight">Life<span className="text-rose-500">Drop</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              একটি রক্তদান প্ল্যাটফর্ম যা জীবন বাঁচাতে দাতা ও গ্রহীতাকে সুরক্ষিতভাবে সংযুক্ত করে। আমাদের অঙ্গীকার একটি রক্তশূন্যহীন সুন্দর পৃথিবী।
            </p>
            <div className="flex gap-4">
              {[ { Icon: FaFacebook, href: '#' }, { Icon: FaXTwitter, href: '#' }, { Icon: FaInstagram, href: '#' }, { Icon: FaLinkedin, href: '#' } ].map((item, idx) => (
                <a key={idx} href={item.href} className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 transition-all hover:bg-rose-600">
                  <item.Icon className="text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

         
          {[ 
            { title: "Quick Links", links: [{name: 'Home', href: '/'}, {name: 'Profile', href: '/donation-requests'}, {name: 'Search Donors', href: '/search-donor'}, {name: 'Login', href: '/login'}] },
            { title: "Resources", links: [{name: 'About Us', href: '/#about'}, {name: 'How It Works', href: '/#how-it-works'}, {name: 'Funding', href: '/#funding'}, {name: 'Contact', href: '/#contact'}] }
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{section.title}</h3>
              <ul className="mt-6 space-y-4 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-rose-500 transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3"><IoLocationOutline className="text-rose-500 text-xl" /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-3"><IoCallOutline className="text-rose-500 text-xl" /> +880 1XXX-XXXXXX</li>
              <li className="flex items-center gap-3"><IoMailOutline className="text-rose-500 text-xl" /> support@lifedrop.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LifeDrop. All rights reserved. Designed with precision for community wellness.
        </div>
      </div>
    </footer>
  );
};

export default Footer;