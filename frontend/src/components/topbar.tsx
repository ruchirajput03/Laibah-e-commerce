import React from 'react'
import { Menu } from 'lucide-react';

const setSidebarOpen = (open: boolean) => {
  // Function to handle sidebar open state 
  console.log("Sidebar open state:", open);
};

const topbar = () => {
  return (
    <div>
          <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default topbar