import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishlistedContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";
import { StripeProvider } from '../context/StripeContext';
import ChatWidget from '@/components/ChatWidget';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Libah",
  description: "Libah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StripeProvider>
              <Toaster position="top-right" reverseOrder={false} />
              {children}
              </StripeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <ChatWidget />

      </body>
    </html>
  );
}
                     