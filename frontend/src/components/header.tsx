"use client"
import React, { useState } from "react";
import { Menu, ShoppingCart, Heart, User, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useWishlist } from '@/context/wishlistedContext';
import {toast} from "react-hot-toast";


const menuItems = [
 
  {
    label: "Men",
    dropdown: ["Shoes", "Clothing", "Watches"],
  },
  {
    label: "Women",
    dropdown: ["Heels", "Bags", "Jewelry"],
  },
];

export default function Header() {
  const {cart} = useCart();
 
const { wishlist } = useWishlist();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
    return (
        <header className="bg-white text-black w-full flex items-center justify-between px-4 lg:px-10 py-5 z-100 fixed">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
            <img src="/Logo.svg" alt="Laibah Logo" className="w-full h-full max-w-[120px]" />
            </Link>
          </div>
    
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <label className="text-sm">New Drops 🔥</label>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium flex items-center gap-1">
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === index && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20">
                    {item.dropdown.map((drop, i) => (
                      <a
                        href="#"
                        key={i}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {drop}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
    
          {/* Search Bar */}
          {searchActive && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-full max-w-md px-4">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300  rounded-md shadow-md focus:outline-none"
              />
            </div>
          )}
    
          {/* Icons */}
          <div className="flex items-center gap-4 text-gray-700 relative z-10">
            <button
              onClick={() => setSearchActive((prev) => !prev)}
              className={`p-1 rounded-full transition ${
                searchActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
    <Link href="/wishlist">
      <Heart className="w-5 h-5 cursor-pointer" />
    </Link>
    {wishlist.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
        {wishlist.length}
      </span>
    )}
  </div>
            <div className="relative">
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5 cursor-pointer" />
      </Link>

      {/* Counter Badge */}
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </div>
            <User className="w-5 h-5 cursor-pointer" />
          </div>
    
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Menu className="w-6 h-6 cursor-pointer" />
          </div>
        </header>
  );
}
