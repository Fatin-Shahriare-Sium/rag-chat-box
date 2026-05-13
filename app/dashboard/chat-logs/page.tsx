"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, Edit2, Check, X } from "lucide-react";
import EditCorrectedResponseModal from "@/components/dashboard/edit-corrected-response-modal";
import StatusUpdateDropdown from "@/components/dashboard/status-update-dropdown";

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

const API_BASE = process.env.NEXT_PUBLIC_N8N_URL;
const ITEMS_PER_PAGE = 10;

export default function AdminChatLogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState<ChatLog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch chat logs
  useEffect(() => {
    fetchChatLogs();
  }, [currentPage]);

  const fetchChatLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}?get=msg-logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array");
      }

      // Simple pagination (in-memory for now)
      setTotalLogs(data.length);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      setLogs(paginatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch chat logs";
      setError(errorMessage);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (log: ChatLog) => {
    setSelectedLog(log);
    setIsEditModalOpen(true);
  };

  const handleCorrectedResponseSave = async (correctedResponse: string, status: string) => {
    if (!selectedLog) return;

    try {
      setUpdatingId(selectedLog.id);

      // Determine update type based on existing corrected_response
      const updateType = selectedLog.corrected_response ? "edit-ai-response" : "ai-response";

      const payload = {
        id: selectedLog.id,
        vector_db_row_id: selectedLog.vector_db_row_id,
        corrected_response: correctedResponse,
        status: status,
      };

      const response = await fetch(`${API_BASE}?update-type=${updateType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to update corrected response");
      }

      // Refresh logs
      setIsEditModalOpen(false);
      await fetchChatLogs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update corrected response";
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (logId: string, newStatus: string) => {
    try {
      setUpdatingId(logId);

      const payload = {
        id: logId,
        status: newStatus,
      };

      const response = await fetch(`${API_BASE}?update-type=status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to update status");
      }

      // Refresh logs
      await fetchChatLogs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update status";
      alert(`Error: ${errorMessage}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "edited":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Chat Logs Management</h1>
        <p className="text-slate-600 mt-2">Review, edit, and manage user chat logs</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <div>
            <p className="font-semibold text-red-900">Error fetching logs</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={fetchChatLogs} className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-slate-600">Loading chat logs...</span>
        </div>
      )}

      {/* Table */}
      {!loading && logs.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Message</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">AI Response</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Corrected Response</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Platform</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{log.user_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="line-clamp-2">{log.message}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="line-clamp-2">{log.ai_response}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="line-clamp-2">{log.corrected_response || <span className="text-slate-400 italic">Not set</span>}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusUpdateDropdown currentStatus={log.status} logId={log.id} onStatusChange={handleStatusChange} isUpdating={updatingId === log.id} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(log.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log.platform}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEditClick(log)} disabled={updatingId === log.id} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm">
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages} ({totalLogs} total logs)
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                Previous
              </button>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                Next
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && !error && (
        <Card className="p-12 text-center">
          <div className="text-slate-500">
            <p className="text-lg font-medium">No chat logs found</p>
            <p className="text-sm mt-2">There are no chat logs to display</p>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      {selectedLog && (
        <EditCorrectedResponseModal
          isOpen={isEditModalOpen}
          log={selectedLog}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedLog(null);
          }}
          onSave={handleCorrectedResponseSave}
          isLoading={updatingId === selectedLog.id}
        />
      )}
    </div>
  );
}
