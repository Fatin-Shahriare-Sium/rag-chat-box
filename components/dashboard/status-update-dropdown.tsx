"use client";

import { Loader2 } from "lucide-react";

interface Props {
  currentStatus: string;
  logId: string;
  onStatusChange: (logId: string, newStatus: string) => Promise<void>;
  isUpdating: boolean;
}

const STATUS_OPTIONS = ["pending", "approved", "edited", "rejected"] as const;

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    case "edited":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

export default function StatusUpdateDropdown({ currentStatus, logId, onStatusChange, isUpdating }: Props) {
  const handleStatusChange = async (newStatus: string) => {
    if (newStatus !== currentStatus) {
      await onStatusChange(logId, newStatus);
    }
  };

  if (isUpdating) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 rounded text-slate-600">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    );
  }

  return (
    <select value={currentStatus} onChange={(e) => handleStatusChange(e.target.value)} disabled={isUpdating} className={`px-3 py-2 rounded border text-sm font-medium cursor-pointer transition-colors hover:opacity-80 disabled:cursor-not-allowed ${getStatusColor(currentStatus)}`}>
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
}
