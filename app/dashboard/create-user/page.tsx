"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ViewAllUsers from "@/components/dashboard/view-all-users";

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_N8N_URL;
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}?auth=create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user. Please try again.");
      }

      if (data.success === "true" || data.success === true) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.error || "Failed to create user. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
            <CardDescription>Add a new user account to the system</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">User created successfully! Redirecting...</p>
                </div>
              )}

              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="John Doe" disabled={isLoading || success} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="user@example.com" disabled={isLoading || success} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="••••••••" disabled={isLoading || success} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading || success} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 transition disabled:cursor-not-allowed" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" disabled={isLoading || success} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading || success} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 transition disabled:cursor-not-allowed" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Password requirements:</span>
                  <br />
                  • Minimum 6 characters
                  <br />• Must match confirmation
                </p>
              </div>

              {/* Create Button */}
              <Button type="submit" disabled={isLoading || success} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Creating User...
                  </div>
                ) : success ? (
                  "User Created Successfully"
                ) : (
                  "Create User"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="border-t border-slate-200 bg-slate-50 flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading || success} className="w-full mr-2">
              Cancel
            </Button>
            <div className="w-px bg-slate-200" />
          </CardFooter>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-slate-600">
          <p>Only admins can create new user accounts</p>
        </div>
      </div>
      <ViewAllUsers />
    </div>
  );
}
