'use client';

import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    image: '',
  });
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const fetchProfile = async () => {
    try {
      const res = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data;
      setProfile({ name: data.name, image: data.image });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && localStorage.getItem('token')) {
      fetchProfile();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md relative z-50">
      <Link href="/" className="text-xl font-bold text-black">
        MovieApp
      </Link>

      {isAuthenticated && user && (<div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="text-gray-600 hover:text-black focus:outline-none"
        >
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full border-2 border-indigo-500 shadow-md"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-indigo-500" />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-100">
              <p className="text-gray-800 font-medium truncate">
                <strong>{profile.name || 'Anonymous User'}</strong></p>
            </div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      )}
    </nav>
  );
};

export default Navbar;
