import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import client from '../api/client';

export default function CropRecommendation() {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {result && result.predicted_crop && (
        <div className="mt-6 card-base p-6 border-l-4 border-l-primary bg-primary/5">
          <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Recommended Crop</h2>
          <p className="text-3xl font-bold text-slate-900 mt-1 capitalize">{result.predicted_crop}</p>
          <p className="text-sm text-primary mt-2 font-medium">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
