"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import {
  LayoutDashboard,
  Package,
  Users,
 
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categoryPage", icon: Menu },
    { name: "Products", href: "/admin/productpage", icon: Package },
    { name: "Users", href: "/admin/user", icon: Users },


  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white  transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 shadow-sm border-gray-200">
        <div className="flex items-center gap-2">
            <Link href="/">
            <Image src="/Logo.svg"
            width={120}
            height={40}
             alt="Laibah Logo"
             className="w-full h-full max-w-[120px]" />
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-3 space-y-1">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {name}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      



    </div>
  );
};

export default Sidebar;
