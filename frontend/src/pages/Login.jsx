import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Login - AgriChain AI';
  }, []);

  const from = location.state?.from?.pathname || "/analytics";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-cyan-50/50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-black rounded-full overflow-hidden shadow-lg border border-slate-700">
            <iframe src="/logo3d.html" className="w-full h-full border-none" scrolling="no"></iframe>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="input-base pl-10"
                  placeholder="admin@agrichain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="input-base pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors">
              Sign in
            </button>
            <button type="button" onClick={() => navigate('/signup')} className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-slate-50 transition-colors">
              Create a new account
            </button>
            <button type="button" onClick={() => navigate('/')} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
