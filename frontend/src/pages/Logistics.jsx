import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import client from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';

export default function Logistics() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('/api/logistics/');
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching logistics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading logistics data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto flex-1">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-base p-6 border-l-4 border-blue-500 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Truck className="w-6 h-6" /></div>
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
        <div className="card-base p-6 border-l-4 border-amber-500 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-full text-amber-600"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Delayed</p>
            <p className="text-2xl font-bold text-slate-900">{shipments.filter(s => s.status === 'Delayed').length}</p>
          </div>
        </div>
      </div>

      <div className="card-base">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
              <th className="py-3 px-6">Tracking ID</th>
              <th className="py-3 px-6">Route</th>
              <th className="py-3 px-6">Cargo</th>
              <th className="py-3 px-6">ETA</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {shipments.map((item) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
