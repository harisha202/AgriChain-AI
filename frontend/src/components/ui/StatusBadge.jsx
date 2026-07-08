import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in transit':
      case 'low stock':
        return 'bg-amber-100 text-amber-800';
      case 'spoilage risk':
      case 'delayed':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
