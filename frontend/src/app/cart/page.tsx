"use client";

import React from "react";
import Link from "next/link";
import {  X, Plus, Minus } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const isCartEmpty = cart.length === 0;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discountTotal = cart.reduce(
    (acc, item) => acc + (item.price * item.quantity * item.discount) / 100,
    0
  );

  const total = subtotal - discountTotal;

  return (
    <>
      <Header />
      <div className="pt-16 sm:pt-20 lg:pt-20 min-h-screen bg-white">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto">
          
          {/* Cart Items Section */}
          <div className="flex-1 w-full">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 pb-3 border-b-2 border-gray-200">
              Shopping Bag
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
                <Link href="/products" className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="relative bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      {/* Remove button - top right */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Product image and basic info */}
                      <Link href={`/productdetail/${item.id}`}>
                        <div className="flex gap-3 mb-3">
                          <div className="w-20 h-20 flex-shrink-0">
                            <Image
                              src={process.env.API_URL + `${item.image}`}
                              width={80}
                              height={80}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-8">
                            <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2">{item.title}</h3>
                            <p className="text-xs text-gray-500 mb-1">{item.colorSize}</p>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-base">AED {item.price.toFixed(2)}</span>
                              {item.discount > 0 && (
                                <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                                  {item.discount}% off
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Quantity controls and total - mobile */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            className="p-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[40px] text-center font-medium">{item.quantity}</span>
                          <button
                            className="p-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-lg">
                            AED {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tablet and Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-4">
                      <Link href={`/productdetail/${item.id}`} className="flex gap-4 items-center flex-1 min-w-0">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0">
                          <Image
                            src={process.env.API_URL + `${item.image}`}
                            width={112}
                            height={112}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base lg:text-lg mb-1 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.colorSize}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">AED {item.price.toFixed(2)}</span>
                            {item.discount > 0 && (
                              <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">
                                {item.discount}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Quantity controls - tablet/desktop */}
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          className="p-2 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4"/>
                        </button>
                        <span className="px-3 py-2 min-w-[50px] text-center font-medium">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-gray-50 transition-colors"
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Total price and remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg min-w-[100px] text-right">
                          AED {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

   
          {!isCartEmpty && (
            <div className="w-full lg:w-96 lg:flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Shipping & Handling</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Estimated Tax</span>
                    <span>-</span>
                  </div>
                  
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Discount</span>
                      <span className="text-red-500">-AED {discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {discountTotal > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 my-4">
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="font-medium">You Saved:</span>
                      <span className="font-semibold">AED {discountTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between font-semibold text-lg sm:text-xl">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700 text-center">
                    🚚 <span className="font-semibold">Free Shipping</span> on your order!
                  </p>
                </div>

                <Link href="/checkout" passHref>
                  <button
                    disabled={isCartEmpty}
                    className="w-full mt-6 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-md transition-all duration-200 bg-black text-white hover:bg-gray-800 active:transform active:scale-98 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                </Link>

                <Link href="/products">
                  <button className="w-full mt-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}