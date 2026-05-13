"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MessageSquare, FileUp, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{greeting}! 👋</h1>
        <p className="text-blue-100 text-lg">Welcome to your admin dashboard. Manage chat logs, upload files, and monitor your system.</p>
      </div>

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chat Logs Card */}
          <Link href="/dashboard/chat-logs">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 hover:border-blue-400">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare size={28} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Manage</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Chat Logs</h3>
              <p className="text-slate-600 mb-4">Review, edit, and manage user chat conversations. Update responses and change status.</p>
              <div className="flex items-center text-blue-600 font-semibold group">
                View Chat Logs
                <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Card>
          </Link>

          {/* Add File Card */}
          <Link href="/dashboard/add-file">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 hover:border-green-400">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileUp size={28} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Upload</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Add File</h3>
              <p className="text-slate-600 mb-4">Upload documents, media files, images, and videos to your workspace.</p>
              <div className="flex items-center text-green-600 font-semibold group">
                Upload Files
                <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      {/* <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Chats</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
                <p className="text-xs text-slate-500 mt-2">+2 from last week</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Files Uploaded</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
                <p className="text-xs text-slate-500 mt-2">2.4 GB total</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <FileUp size={24} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Messages</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
                <p className="text-xs text-slate-500 mt-2">Last 30 days</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      </div> */}

      {/* Recent Activity */}
      {/* <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { activity: "Chat log updated", time: "2 hours ago", status: "completed" },
            { activity: "File uploaded successfully", time: "5 hours ago", status: "completed" },
            { activity: "Status changed to approved", time: "1 day ago", status: "completed" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-0">
              <div>
                <p className="font-medium text-slate-900">{item.activity}</p>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{item.status}</span>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
}
