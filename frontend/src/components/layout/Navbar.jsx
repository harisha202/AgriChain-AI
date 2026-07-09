import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Bell, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 sticky top-0">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-900 md:hidden" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </button>
        )}
        <Link to={user ? "/analytics" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <iframe 
            src="/logo3d.html" 
            title="AgriChain AI 3D Logo" 
            className="h-10 w-10 border-none rounded-full overflow-hidden" 
            scrolling="no"
          ></iframe>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">AgriChain <span className="text-primary">AI</span></span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Welcome, {user.name}</span>
              <button onClick={() => {
                navigate('/', { replace: true });
                setTimeout(() => logout(), 10);
              }} className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1">
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
