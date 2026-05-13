"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Database, ShieldCheck, ArrowRight, LayoutDashboard, LogIn, Bot, Zap, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check for user data in localStorage (as set in login/page.tsx)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.user_type) {
          setIsLoggedIn(true);
          setUserName(user.name || "Admin");
        }
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                RAG<span className="text-blue-600">Admin</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="h-3 w-3 fill-blue-600" />
              Advanced RAG Management
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Control Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Knowledge Base</span> with Precision
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">The ultimate administrative panel for RAG-based chat systems. Manage documents, monitor logs, and orchestrate user feedback in one unified interface.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 group">
                      Admin Login
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Vector Database</h3>
                <p className="text-slate-500">Monitor and manage your embedding indexes and source documents in real-time.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Log Analysis</h3>
                <p className="text-slate-500">Trace every query and response. Analyze retrieval performance and token usage.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">User Guardrails</h3>
                <p className="text-slate-500">Define access controls and monitoring rules for all chat interactions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">99.9%</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">&lt;2s</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Latency</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">M+</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Tokens/Day</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Monitoring</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
