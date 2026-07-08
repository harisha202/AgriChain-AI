import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Bell, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="flex items-center gap-2">
        <button className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-900 md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="#1F7A3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">AgriChain <span className="text-primary">AI</span></span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors" onClick={() => alert("Notifications coming soon!")}>
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Welcome, {user.name}</span>
              <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-medium bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md shadow-sm transition-colors flex items-center gap-2">
                <User className="h-4 w-4" /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
