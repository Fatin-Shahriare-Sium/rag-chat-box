"use client";

import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatLog {
  id: string;
  user_id: string;
  platform: string;
  message: string;
  ai_response: string;
  corrected_response: string;
  status: "pending" | "approved" | "edited" | "rejected";
  embedding_synced: boolean;
  created_at: string;
  vector_db_row_id: number | null;
}

interface Props {
  isOpen: boolean;
  log: ChatLog;
  onClose: () => void;
  onSave: (correctedResponse: string, status: string) => Promise<void>;
  isLoading: boolean;
}

const STATUS_OPTIONS = ["pending", "approved", "edited", "rejected"] as const;

export default function EditCorrectedResponseModal({ isOpen, log, onClose, onSave, isLoading }: Props) {
  const [correctedResponse, setCorrectedResponse] = useState(log.corrected_response || "");
  const [selectedStatus, setSelectedStatus] = useState(log.status);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLocalError(null);

      if (!correctedResponse.trim()) {
        setLocalError("Corrected response cannot be empty");
        return;
      }

      await onSave(correctedResponse, selectedStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setLocalError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
        <Card className="p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Edit Chat Log</h2>
            <button onClick={onClose} disabled={isLoading} className="p-1 hover:bg-slate-100 rounded transition-colors disabled:opacity-50">
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* User and Date Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 font-medium">User ID</p>
                <p className="text-slate-900">{log.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Date</p>
                <p className="text-slate-900">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Original Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Original Message</label>
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{log.message}</p>
              </div>
            </div>

            {/* AI Response */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">AI Response</label>
              <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-slate-700 whitespace-pre-wrap">{log.ai_response}</p>
              </div>
            </div>

            {/* Corrected Response */}
            <div>
              <label htmlFor="corrected-response" className="block text-sm font-semibold text-slate-900 mb-2">
                Corrected Response *
              </label>
              <textarea id="corrected-response" value={correctedResponse} onChange={(e) => setCorrectedResponse(e.target.value)} disabled={isLoading} className="w-full p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-100 disabled:cursor-not-allowed" rows={6} placeholder="Enter the corrected response..." />
              {localError && correctedResponse.trim() === "" && <p className="text-red-600 text-sm mt-2">{localError}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status-select" className="block text-sm font-semibold text-slate-900 mb-2">
                Status
              </label>
              <select id="status-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as "pending" | "approved" | "edited" | "rejected")} disabled={isLoading} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed">
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Alert */}
            {localError && correctedResponse.trim() !== "" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{localError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isLoading || !correctedResponse.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
