'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Send,
  Paperclip,
  Loader,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
  File,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  uploadedFile?: {
    name: string;
    type: string;
    size: number;
  };
}

interface ApiResponse {
  query: string;
  results: string;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/json',
  'text/csv',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function ChatBoxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError(
        `File type not allowed. Please upload: PDF, TXT, DOC, XLS, Images, JSON, or CSV`
      );
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size must be less than 50MB`);
      return;
    }

    // Validate video files (by extension as fallback)
    if (
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.avi') ||
      file.name.endsWith('.mov') ||
      file.name.endsWith('.mkv')
    ) {
      setUploadError('Video files are not allowed');
      return;
    }

    setUploadedFile(file);
  };

  const uploadFile = async () => {
    if (!uploadedFile) return;

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(`File "${uploadedFile.name}" uploaded successfully`);

      // Add system message about file upload
      const fileMessage: Message = {
        id: `file-${Date.now()}`,
        type: 'user',
        content: `📎 File uploaded: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(2)} KB)`,
        timestamp: new Date(),
        uploadedFile: {
          name: uploadedFile.name,
          type: uploadedFile.type,
          size: uploadedFile.size,
        },
      };

      setMessages((prev) => [...prev, fileMessage]);
      setUploadedFile(null);
      setInput('');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setUploadError(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedFile) return;

    // If file is selected but not uploaded yet, upload it first
    if (uploadedFile && !uploadSuccess) {
      await uploadFile();
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setUploadSuccess(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(
        `${apiUrl}/search?query=${encodeURIComponent(input)}&top_k=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: data.results || 'No results found',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorContent =
        error instanceof Error ? error.message : 'Failed to get response from API';

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: `❌ Error: ${errorContent}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Chat</h1>

        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="text-xs"
            >
              Clear Chat
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                  ✨
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Upload a file or ask a question to get started. I&apos;ll help you find answers.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 animate-fadeIn ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                  {message.uploadedFile && (
                    <div className="mt-2 pt-2 border-t border-opacity-20 border-gray-300">
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <File className="w-3 h-3" />
                        <span>{message.uploadedFile.name}</span>
                        <span>({(message.uploadedFile.size / 1024).toFixed(2)} KB)</span>
                      </div>
                    </div>
                  )}

                  <span className="text-xs mt-2 block opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    U
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-4 justify-start animate-fadeIn">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Upload Status Messages */}
          {uploadError && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
            </div>
          )}

          {uploadSuccess && (
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-300">{uploadSuccess}</p>
            </div>
          )}

          {/* File Upload Section */}
          {uploadedFile && (
            <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadLoading ? (
                    <Loader className="w-4 h-4 animate-spin text-orange-600 dark:text-orange-400" />
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="h-8 px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={uploadFile}
                        className="h-8 px-2 text-xs bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
                      >
                        Upload
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Input Field */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question or type a message... (Shift+Enter for new line)"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                maxLength={2000}
                disabled={loading}
              />
              <span className="absolute right-3 bottom-2 text-xs text-gray-400">
                {input.length}/2000
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploadLoading}
                className="px-3 h-10"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(',')}
              />

              <Button
                onClick={handleSendMessage}
                disabled={loading || uploadLoading || (!input.trim() && !uploadedFile)}
                className="px-4 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: You can upload files (PDF, TXT, Images, etc.) before asking questions
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
