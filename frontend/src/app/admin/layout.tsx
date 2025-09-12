'use client';


import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "@/components/topbar"
import ProtectedRoute from "@/components/ProtectedRoutes";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar children={undefined} />
      <div className="flex-1 relative ">
        <Header />
        <ProtectedRoute>
        <main className="p-4 sm:p-6 ">{children}</main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default Layout;
