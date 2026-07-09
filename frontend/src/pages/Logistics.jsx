import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import client from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';

export default function Logistics() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    shipment_id: '', crop_name: '', quantity_kg: '', origin: '', destination: '', estimated_arrival: '', status: 'In Transit'
  });

  const fetchData = async () => {
    try {
      const response = await client.get('/api/logistics/');
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching logistics data", error);
      setError(error.response?.data?.detail || "Failed to load logistics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddShipment = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await client.post('/api/logistics/', {
        ...formData,
        quantity_kg: parseFloat(formData.quantity_kg)
      });
      setShowModal(false);
      setFormData({ shipment_id: '', crop_name: '', quantity_kg: '', origin: '', destination: '', estimated_arrival: '', status: 'In Transit' });
      fetchData(); // Refresh table
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add shipment. Check if you have enough inventory for this crop.");
    } finally {
      setAdding(false);
    }
  };

  const handleMarkDelivered = async (shipmentId) => {
    try {
      await client.put(`/api/logistics/${shipmentId}`, { status: 'Delivered' });
      fetchData(); // Refresh table to show Delivered status and trigger backend Sales history
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading logistics data...</div>;

  return (
    <div className="min-h-full bg-amber-50/50 w-full flex flex-col">
      <div className="p-8 max-w-7xl mx-auto flex-1 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Logistics & Distribution</h1>
            <p className="text-slate-500 text-sm">Real-time farm-to-market tracking</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Shipment
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-base p-6 border-l-4 border-amber-500 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-full text-amber-600"><Truck className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Transit</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter(s => s.status === 'In Transit').length}</p>
          </div>
        </div>
        <div className="card-base p-6 border-l-4 border-green-500 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Delivered</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter(s => s.status === 'Delivered').length}</p>
          </div>
        </div>
        <div className="card-base p-6 border-l-4 border-red-500 flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-full text-red-600"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Delayed</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter(s => s.status === 'Delayed').length}</p>
          </div>
        </div>
      </div>

      <div className="card-base overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
              <th className="py-3 px-6">Tracking ID</th>
              <th className="py-3 px-6">Route</th>
              <th className="py-3 px-6">Cargo</th>
              <th className="py-3 px-6">ETA</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">No logistics records found.</td>
              </tr>
            ) : (
              shipments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">{item.shipment_id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{item.origin} &rarr; {item.destination}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium">{item.crop_name}</span> <span className="text-slate-500">({item.quantity_kg.toLocaleString()} kg)</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(item.estimated_arrival).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    {item.status !== 'Delivered' && (
                      <button 
                        onClick={() => handleMarkDelivered(item.id)}
                        className="text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors border border-green-200"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Dispatch New Shipment</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddShipment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tracking ID</label>
                  <input type="text" name="shipment_id" required className="input-base" onChange={handleInputChange} value={formData.shipment_id} placeholder="e.g. TRK-9988" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Crop Name</label>
                  <input type="text" name="crop_name" required className="input-base" onChange={handleInputChange} value={formData.crop_name} placeholder="e.g. Rice" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity (kg)</label>
                  <input type="number" step="0.1" name="quantity_kg" required className="input-base" onChange={handleInputChange} value={formData.quantity_kg} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ETA (Date)</label>
                  <input type="date" name="estimated_arrival" required className="input-base" onChange={handleInputChange} value={formData.estimated_arrival} />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Origin (Warehouse)</label>
                    <input type="text" name="origin" required className="input-base" onChange={handleInputChange} value={formData.origin} placeholder="Zone A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                    <input type="text" name="destination" required className="input-base" onChange={handleInputChange} value={formData.destination} placeholder="Mumbai Market" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" className="input-base" onChange={handleInputChange} value={formData.status}>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary">
                  {adding ? 'Dispatching...' : 'Dispatch Shipment'}
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
