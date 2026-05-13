"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, FileUp, Menu, X, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cook } from "@hugeicons/core-free-icons";
import Cookies from "js-cookie";
export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    {
      label: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Chat Logs",
      href: "/dashboard/chat-logs",
      icon: MessageSquare,
    },
    {
      label: "Add File",
      href: "/dashboard/add-file",
      icon: FileUp,
    },
    {
      label: "Create User",
      href: "/dashboard/create-user",
      icon: PlusCircleIcon,
    },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    // Clear user data from localStorage and cookies
    localStorage.removeItem("user");
    Cookies.remove("userType");
    Cookies.remove("email");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button onClick={toggleSidebar} className="fixed md:hidden top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 text-white h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out",
          // Desktop styles
          "md:w-64 md:fixed md:left-0 md:top-0",
          // Mobile styles
          "fixed left-0 top-0 w-64 z-40",
          // Mobile responsive
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
        )}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MyChat</h1>
            <p className="text-slate-400 text-sm">Dashboard</p>
          </div>
          {/* Close button for mobile header */}
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group", isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white")}>
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
