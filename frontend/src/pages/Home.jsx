import React from 'react';
import { ArrowRight, Leaf, TrendingUp, Truck, Database, Layout, BrainCircuit, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light text-sm font-medium mb-6 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Enterprise-Grade Supply Chain Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Smart Farming & Agri <span className="text-primary-light">Supply Chain</span> Platform
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
              AgriChain AI bridges the gap between precision agriculture and enterprise supply chain management. We treat every farm as a supply chain node—where AI crop recommendations feed directly into demand forecasting, inventory optimization, and logistics tracking.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/analytics" className="btn-primary flex items-center gap-2 px-6 py-3 text-lg">
                View Analytics <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/crop" className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 px-6 py-3 rounded-md transition-colors text-lg font-medium border border-slate-700">
                Try Crop AI
              </Link>
            </div>
          </div>
          
          {/* 3D Logo Integration */}
          <div className="relative h-[400px] w-full flex items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group">
            <iframe 
              src="/logo3d.html" 
              title="AgriChain AI 3D Logo" 
              className="w-full h-full border-none transition-transform duration-700 group-hover:scale-105"
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

      {/* Technical Architecture */}
      <section className="py-20 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Tech Stack</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Built to scale. AgriChain AI leverages a modern, decoupled architecture combining a lightning-fast React frontend with a robust, data-science-ready Python backend.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded shadow-sm text-primary"><Layout className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Frontend</h4>
                    <p className="text-sm text-slate-500 mt-1">React, Vite, Tailwind CSS, Recharts for dynamic visual analytics.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded shadow-sm text-primary"><Database className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Backend API</h4>
                    <p className="text-sm text-slate-500 mt-1">FastAPI (Python) with SQLAlchemy ORM, JWT Auth, and SQLite/PostgreSQL.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded shadow-sm text-primary"><BrainCircuit className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Machine Learning</h4>
                    <p className="text-sm text-slate-500 mt-1">Scikit-Learn (Random Forest) for classification, Statsmodels (SARIMA) for forecasting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded shadow-sm text-primary"><LineChart className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Data Engineering</h4>
                    <p className="text-sm text-slate-500 mt-1">Pandas for high-performance grouping, rolling aggregations, and time-series analysis.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="aspect-square max-w-md mx-auto bg-slate-900 rounded-full flex items-center justify-center p-8 shadow-2xl relative">
                {/* Decorative orbiting rings */}
                <div className="absolute inset-4 border-2 border-dashed border-slate-700 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute inset-12 border border-slate-600 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                <div className="text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">AgriChain Core</h3>
                  <p className="text-primary-light font-mono text-sm">v1.0.0-production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Supply Chain?</h2>
          <p className="text-primary-light text-lg mb-8">
            Access the dashboard to view real-time logistics analytics, inventory alerts, and AI-driven demand forecasts.
          </p>
          <Link to="/dashboard" className="bg-white text-primary hover:bg-slate-50 px-8 py-4 rounded-md font-bold text-lg shadow-lg transition-colors inline-block">
            Launch Platform
          </Link>
        </div>
      </section>
    </div>
  );
}
