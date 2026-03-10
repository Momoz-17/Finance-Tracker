import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth'); 
    window.location.reload(); 
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <TrendingUp size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Finance Tracker
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            {token ? (
              <>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                  <User size={18} />
                  <span className="hidden md:inline">{user?.username || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;