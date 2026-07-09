import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Leaf, Package, TrendingUp, Truck, BarChart2, MessageSquare, X } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Crop AI', path: '/crop', icon: Leaf },
  { name: 'Inventory', path: '/inventory', icon: Package },
  { name: 'Demand Forecast', path: '/forecast', icon: TrendingUp },
  { name: 'Logistics', path: '/logistics', icon: Truck },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Assistant', path: '/assistant', icon: MessageSquare },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={clsx(
          "fixed inset-0 bg-slate-900/50 z-20 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-30 transform transition-transform duration-200 ease-in-out md:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-200">
          <span className="font-bold text-slate-900">Menu</span>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
