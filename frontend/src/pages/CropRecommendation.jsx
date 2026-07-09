import React, { useState } from 'react';
import { Leaf, Sun, CloudRain, Calendar } from 'lucide-react';
import client from '../api/client';

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/api/crop/predict', {
        N: parseFloat(formData.N),
        P: parseFloat(formData.P),
        K: parseFloat(formData.K),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall)
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "Failed to get a recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-emerald-50/50 w-full">
      <div className="p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Crop Recommendation AI</h1>
      </div>
      
      <div className="card-base p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nitrogen (N)</label>
              <input type="number" name="N" required className="input-base" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phosphorus (P)</label>
              <input type="number" name="P" required className="input-base" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Potassium (K)</label>
              <input type="number" name="K" required className="input-base" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°C)</label>
              <input type="number" step="0.1" name="temperature" required className="input-base" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Humidity (%)</label>
              <input type="number" step="0.1" name="humidity" required className="input-base" onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">pH Level</label>
              <input type="number" step="0.1" name="ph" required className="input-base" onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Rainfall (mm)</label>
              <input type="number" step="0.1" name="rainfall" required className="input-base" onChange={handleChange} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
            {loading ? 'Analyzing Soil Data...' : 'Get Recommendation'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && result.predicted_crop && (
        <div className="mt-6 space-y-6">
          <div className="card-base p-6 border-l-4 border-l-primary bg-primary/5">
            <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Recommended Crop</h2>
            <p className="text-3xl font-bold text-slate-900 mt-1 capitalize">{result.predicted_crop}</p>
            <p className="text-sm text-primary mt-2 font-medium">
              Confidence: {result.confidence != null ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          
          <div className="card-base p-6 bg-white">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-accent" /> Growth & Weather Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Optimal Season</p>
                  <p className="text-slate-900 font-medium mt-1">{result.optimal_season || 'Unknown'}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Growth Duration</p>
                  <p className="text-slate-900 font-medium mt-1">{result.growth_duration || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-1">Climatic Requirement:</span>
              {result.weather_insight || 'Consult local agricultural guidelines for precise climatic requirements.'}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
