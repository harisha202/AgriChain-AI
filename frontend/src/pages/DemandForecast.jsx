import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DemandForecast() {
  useDocumentTitle('Forecast');
  const [cropName, setCropName] = useState('rice');
  const [daysAhead, setDaysAhead] = useState(30);
  const [forecastData, setForecastData] = useState([]);
  const [accuracyMetrics, setAccuracyMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchAccuracy = async () => {
      try {
        const response = await client.get('/api/forecast/accuracy');
        if (Array.isArray(response.data)) {
          setAccuracyMetrics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch accuracy", error);
      }
    };
    fetchAccuracy();
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/api/forecast/demand', {
        crop_name: cropName, 
        days_ahead: daysAhead 
      });
      if (response.data.forecasts) {
        setForecastData(response.data.forecasts);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "Failed to generate forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-purple-50/50 w-full animate-fade-in">
      <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demand Forecasting</h1>
          <p className="text-slate-500 text-sm">SARIMA Time-Series Predictions</p>
        </div>
      </div>
      
      <div className="card-base p-6 mb-8 flex gap-4 items-end bg-white">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Crop</label>
          <select value={cropName} onChange={(e) => setCropName(e.target.value)} className="input-base w-48">
            <option value="rice">Rice</option>
            <option value="maize">Maize</option>
            <option value="chickpea">Chickpea</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Days Ahead</label>
          <input type="number" min="7" max="90" value={daysAhead} onChange={(e) => setDaysAhead(parseInt(e.target.value))} className="input-base w-32" />
        </div>
        <button onClick={fetchForecast} disabled={loading} className="btn-primary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {loading ? 'Running Model...' : 'Run Forecast'}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="card-base p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Predicted Demand for {cropName.toUpperCase()}</h2>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickMargin={10} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `${val}kg`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend />
                <Line type="monotone" dataKey="predicted_demand" name="Forecast Demand (kg)" stroke="#1F7A3F" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {accuracyMetrics.length > 0 && accuracyMetrics.find(a => a.crop_name.toLowerCase() === cropName.toLowerCase()) && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-700">Model Accuracy</h4>
                <p className="text-xs text-slate-500">Based on historical sales vs predictions</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  MAE: {accuracyMetrics.find(a => a.crop_name.toLowerCase() === cropName.toLowerCase()).mae != null 
                    ? `${accuracyMetrics.find(a => a.crop_name.toLowerCase() === cropName.toLowerCase()).mae.toFixed(2)} kg` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
