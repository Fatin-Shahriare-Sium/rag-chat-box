"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { FileUp, AlertCircle, CheckCircle, Loader2, X, Download, Trash2 } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: "success" | "pending" | "error";
  error?: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_N8N_URL;

// Allowed file types and their extensions
const ALLOWED_FILE_TYPES = {
  documents: [".pdf", ".doc", ".docx", ".txt", ".csv", ".xlsx", ".xls"],
  media: [],
  images: [],
  video: [],
};

const ALL_ALLOWED_EXTENSIONS = Object.values(ALLOWED_FILE_TYPES).flat();
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function AddFilePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf("."));

    if (ALLOWED_FILE_TYPES.documents.includes(extension)) {
      return "📄";
    }
    if (ALLOWED_FILE_TYPES.media.includes(extension)) {
      return "🎵";
    }
    if (ALLOWED_FILE_TYPES.images.includes(extension)) {
      return "🖼️";
    }
    if (ALLOWED_FILE_TYPES.video.includes(extension)) {
      return "🎬";
    }
    return "📎";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALL_ALLOWED_EXTENSIONS.includes(extension)) {
      return `File type not allowed: ${extension}. Allowed types: ${ALL_ALLOWED_EXTENSIONS.join(", ")}`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 100MB limit. Your file is ${formatFileSize(file.size)}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setUploadedFiles((prev) => [
        {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toLocaleString(),
          status: "error",
          error: validationError,
        },
        ...prev,
      ]);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("data", file);

      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Server returned unsuccessful response");
      }

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString(),
        status: "success",
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setSuccess(`File "${file.name}" uploaded successfully!`);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload file";
      setError(errorMessage);

      setUploadedFiles((prev) => [
        {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toLocaleString(),
          status: "error",
          error: errorMessage,
        },
        ...prev,
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      await uploadFile(file);
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Upload Files</h1>
        <p className="text-slate-600 mt-2">Upload documents, media, images, and more to your workspace</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-semibold text-green-900">Success</p>
            <p className="text-sm text-green-700">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="ml-auto p-1 hover:bg-green-100 rounded transition-colors">
            <X size={18} className="text-green-600" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <div>
            <p className="font-semibold text-red-900">Upload Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded transition-colors">
            <X size={18} className="text-red-600" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <Card className={`p-12 border-2 border-dashed transition-all duration-200 cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-slate-300 hover:border-slate-400 bg-white"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} disabled={uploading} accept={ALL_ALLOWED_EXTENSIONS.join(",")} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-lg transition-colors ${isDragging ? "bg-blue-200" : "bg-blue-100"}`}>
            <FileUp size={40} className={isDragging ? "text-blue-700" : "text-blue-600"} />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">Drag and drop your file here</h3>
            <p className="text-slate-600 text-sm mt-1">or click to browse from your computer</p>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded">
            <p className="font-medium mb-2">Supported file types:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-slate-700">Documents:</p>
                <p>{ALLOWED_FILE_TYPES.documents.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Media:</p>
                <p>{ALLOWED_FILE_TYPES.media.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Images:</p>
                <p>{ALLOWED_FILE_TYPES.images.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Video:</p>
                <p>{ALLOWED_FILE_TYPES.video.join(", ")}</p>
              </div>
            </div>
            <p className="mt-2 text-slate-600">Max file size: 100MB</p>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 size={18} className="animate-spin" />
              <span>Uploading file...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Upload Statistics */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex flex-col">
              <span className="text-slate-600 text-sm font-medium">Total Uploads</span>
              <span className="text-3xl font-bold text-slate-900 mt-2">{uploadedFiles.length}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col">
              <span className="text-slate-600 text-sm font-medium">Successful</span>
              <span className="text-3xl font-bold text-green-600 mt-2">{uploadedFiles.filter((f) => f.status === "success").length}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col">
              <span className="text-slate-600 text-sm font-medium">Failed</span>
              <span className="text-3xl font-bold text-red-600 mt-2">{uploadedFiles.filter((f) => f.status === "error").length}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Uploads */}
      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Uploads</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className={`p-4 flex items-center justify-between transition-all ${file.status === "error" ? "bg-red-50 border-red-200" : "hover:shadow-md"}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{getFileIcon(file.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(file.size)} • {file.uploadedAt}
                    </p>
                    {file.error && <p className="text-sm text-red-600 mt-1">{file.error}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {file.status === "success" && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle size={14} />
                      Uploaded
                    </div>
                  )}
                  {file.status === "error" && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      <AlertCircle size={14} />
                      Failed
                    </div>
                  )}
                  {file.status === "pending" && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      <Loader2 size={14} className="animate-spin" />
                      Uploading
                    </div>
                  )}

                  {file.status === "success" && (
                    <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
                  )}

                  <button onClick={() => handleRemoveFile(file.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && !uploading && (
        <Card className="p-12 text-center bg-slate-50">
          <div className="text-slate-500">
            <p className="text-lg font-medium">No files uploaded yet</p>
            <p className="text-sm mt-2">Upload your first file by dragging and dropping or clicking above</p>
          </div>
        </Card>
      )}
    </div>
  );
}
