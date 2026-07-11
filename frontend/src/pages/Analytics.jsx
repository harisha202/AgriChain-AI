import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, DollarSign, Package } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import { SkeletonKpiRow, SkeletonChartGrid } from '../components/ui/Skeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const COLORS = ['#1F7A3F', '#E0A526', '#334155', '#94a3b8'];

export default function Analytics() {
  useDocumentTitle('Analytics');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await client.get('/api/analytics/dashboard');
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
  <div className="min-h-full bg-indigo-50/50 w-full animate-fade-in">
    <div className="p-8 max-w-7xl mx-auto">
      <SkeletonKpiRow count={4} />
      <SkeletonChartGrid count={4} />
    </div>
  </div>
);
  if (!data || data.message) return <div className="p-8 text-slate-500">{data?.message || 'Failed to load data.'}</div>;

  return (
    <div className="min-h-full bg-indigo-50/50 w-full animate-fade-in">
      <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supply Chain Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card-base p-6 flex items-center gap-4 border-l-4 border-primary">
          <div className="p-4 bg-primary/10 text-primary rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase">Total Revenue</p>
            <h2 className="text-3xl font-bold text-slate-900">${data.kpis.total_revenue.toLocaleString()}</h2>
          </div>
        </div>
        <div className="card-base p-6 flex items-center gap-4 border-l-4 border-accent">
          <div className="p-4 bg-accent/10 text-accent rounded-full">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase">Total Volume (KG)</p>
            <h2 className="text-3xl font-bold text-slate-900">{data.kpis.total_volume_kg.toLocaleString()} kg</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Monthly Revenue Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sales_trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A3F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1F7A3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sale_date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#1F7A3F" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Regional Sales Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regional_distribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="region" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Bar dataKey="quantity_sold" fill="#E0A526" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Crop */}
        <div className="card-base p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Breakdown by Crop</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenue_by_crop}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="revenue"
                  nameKey="crop_name"
                  label={({crop_name, percent}) => `${crop_name.toUpperCase()} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.revenue_by_crop.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 500, color: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
