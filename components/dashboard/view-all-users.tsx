"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, ShieldCheck, Calendar, RefreshCcw, Search, AlertCircle, MoreVertical, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function ViewAllUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://n8n.srv1195395.hstgr.cloud/webhook/update-feedback-logs?get=users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.type.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            User Accounts
          </h1>
          <p className="text-slate-500 text-sm">Manage and monitor all created user accounts</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={loading} className="flex items-center gap-2">
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 mb-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Database Records</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
              <p className="text-slate-500 font-medium">Loading user data...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="bg-red-50 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-900 font-semibold">Failed to load users</p>
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
              <Button onClick={fetchUsers} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <UserCircle className="h-12 w-12 text-slate-200 mx-auto" />
              <p className="text-slate-500 font-medium font-medium">No users found</p>
              {searchQuery && <p className="text-slate-400 text-xs">Try adjusting your search filters</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 pl-0 font-semibold text-slate-600 text-sm">User Details</th>
                    <th className="pb-4 font-semibold text-slate-600 text-sm">Account Type</th>
                    <th className="pb-4 font-semibold text-slate-600 text-sm">Created</th>
                    <th className="pb-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">{user.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-none">{user.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.type === "super-admin" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
                          <ShieldCheck className="h-3 w-3" />
                          {user.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs">{formatDate(user.created_at)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50/30 border-t border-slate-100 py-3 block">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">System Records • {filteredUsers.length} total entries</p>
        </CardFooter>
      </Card>
    </div>
  );
}
