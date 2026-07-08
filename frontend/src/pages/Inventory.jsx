import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import client from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState({ low_stock_items: [], spoilage_risks: [] });
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading inventory data...</div>;

  return (
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
        <button className="btn-primary flex items-center gap-2" onClick={() => alert("Add Stock functionality coming soon!")}>
          <Plus className="w-4 h-4" /> Add Stock
        </button>
      </div>

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
      <div className="card-base">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
              <th className="py-3 px-6">Crop</th>
              <th className="py-3 px-6">Quantity (kg)</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Env Control</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">No inventory records found.</td>
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
                  <td className="py-3 px-6 text-right">
                    <button className="text-primary hover:text-primary-dark font-medium mr-3" onClick={() => alert("Edit functionality coming soon!")}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
