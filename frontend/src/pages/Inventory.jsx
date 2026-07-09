import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, X } from 'lucide-react';
import client from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState({ low_stock_items: [], spoilage_risks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    crop_name: '', quantity_kg: '', warehouse_location: '', optimal_temperature: '', optimal_humidity: '', status: 'Good'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, alertRes] = await Promise.all([
        client.get('/api/inventory/'),
        client.get('/api/inventory/alerts')
      ]);
      setInventory(invRes.data);
      setAlerts(alertRes.data);
    } catch (error) {
      console.error("Error fetching inventory data", error);
      setError(error.response?.data?.detail || "Failed to load inventory data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddStock = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await client.post('/api/inventory/', {
        ...formData,
        quantity_kg: parseFloat(formData.quantity_kg),
        optimal_temperature: parseFloat(formData.optimal_temperature),
        optimal_humidity: parseFloat(formData.optimal_humidity)
      });
      setShowModal(false);
      setFormData({ crop_name: '', quantity_kg: '', warehouse_location: '', optimal_temperature: '', optimal_humidity: '', status: 'Good' });
      fetchData(); // Refresh table
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add stock.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading inventory data...</div>;

  return (
    <div className="min-h-full bg-blue-50/50 w-full">
      <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
            <p className="text-slate-500 text-sm">Track crop stock levels and spoilage risks</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Stock
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Alerts Section */}
      {(alerts.low_stock_items.length > 0 || alerts.spoilage_risks.length > 0) && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.low_stock_items.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
                <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                  {alerts.low_stock_items.map(item => (
                    <li key={item.id}>{item.crop_name.toUpperCase()}: {item.quantity_kg} kg remaining</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {alerts.spoilage_risks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Spoilage Risk</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {alerts.spoilage_risks.map(item => (
                    <li key={item.id}>{item.crop_name.toUpperCase()}: {item.status}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventory Table */}
      <div className="card-base overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
              <th className="py-3 px-6">Crop</th>
              <th className="py-3 px-6">Quantity (kg)</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Env Control</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">No inventory records found.</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-slate-900 capitalize">{item.crop_name}</td>
                  <td className="py-3 px-6">{item.quantity_kg.toLocaleString()} kg</td>
                  <td className="py-3 px-6">{item.warehouse_location}</td>
                  <td className="py-3 px-6 text-slate-500">
                    {item.optimal_temperature}°C / {item.optimal_humidity}%
                  </td>
                  <td className="py-3 px-6">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Add New Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crop Name</label>
                <input type="text" name="crop_name" required className="input-base" onChange={handleInputChange} value={formData.crop_name} placeholder="e.g. Rice" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (kg)</label>
                  <input type="number" step="0.1" name="quantity_kg" required className="input-base" onChange={handleInputChange} value={formData.quantity_kg} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" name="warehouse_location" required className="input-base" onChange={handleInputChange} value={formData.warehouse_location} placeholder="Zone A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Opt. Temp (°C)</label>
                  <input type="number" step="0.1" name="optimal_temperature" required className="input-base" onChange={handleInputChange} value={formData.optimal_temperature} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Opt. Humidity (%)</label>
                  <input type="number" step="0.1" name="optimal_humidity" required className="input-base" onChange={handleInputChange} value={formData.optimal_humidity} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" className="input-base" onChange={handleInputChange} value={formData.status}>
                  <option value="Good">Good</option>
                  <option value="Needs Review">Needs Review</option>
                  <option value="Spoiling">Spoiling</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary">
                  {adding ? 'Saving...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
