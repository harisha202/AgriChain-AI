import React, { useEffect } from 'react';
import { ArrowRight, Leaf, TrendingUp, Truck, Database, Layout, BrainCircuit, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    document.title = 'AgriChain AI - Supply Chain Analytics';
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white py-20 px-8 relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-slate-900">
              Smart Farming & Agri <span className="text-primary">Supply Chain</span> Platform
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-xl leading-relaxed">
              AgriChain AI bridges the gap between precision agriculture and enterprise supply chain management. We treat every farm as a supply chain node—where AI crop recommendations feed directly into demand forecasting, inventory optimization, and logistics tracking.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/login" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg">
                Login
              </Link>
              <Link to="/signup" className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 px-6 py-3 rounded-md transition-colors text-lg font-medium border border-slate-800">
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* 3D Logo Integration */}
          <div className="relative h-[400px] w-full bg-black rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <iframe 
              src="/logo3d.html" 
              title="AgriChain AI 3D Logo" 
              className="w-full h-full border-none"
              scrolling="no"
            ></iframe>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none"></div>
      </section>

      {/* The SCM & MBA Value Proposition */}
      <section className="py-20 px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why AgriChain AI?</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Most "smart farming" platforms stop at crop prediction. AgriChain AI goes further by integrating predictive agriculture with **real-world Supply Chain Management (SCM)** principles. It is engineered to solve complex logistics problems, making it a perfect demonstration of demand planning and SCM analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-base p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Precision Production</h3>
              <p className="text-slate-600 leading-relaxed">
                Utilizes Scikit-Learn Random Forest models to analyze soil health (N, P, K, pH) and weather patterns, ensuring the supply chain begins with optimized, data-backed crop production.
              </p>
            </div>

            <div className="card-base p-8 hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-accent">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Demand Forecasting</h3>
              <p className="text-slate-600 leading-relaxed">
                Employs SARIMA time-series mathematical modeling on historical sales data to project market demand weeks in advance, preventing inventory overstock and reducing bullwhip effects.
              </p>
            </div>

            <div className="card-base p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-6">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Logistics & Inventory</h3>
              <p className="text-slate-600 leading-relaxed">
                Tracks warehouse shipments in real-time. Features dynamic alerts for low stock and spoilage risks (temperature/humidity tracking) to ensure peak supply chain efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
