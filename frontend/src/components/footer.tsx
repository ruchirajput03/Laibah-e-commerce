import Link from "next/link";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#F7F7FA] text-black text-sm w-full  bottom-0">
  <div className="max-w-6xl mx-auto pt-[20px] lg:pt-[40px] px-[20px] lg:px-[40px] mb-4 lg:mb-[40px] overflow-hidden grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
    
    {/* FOLLOW US */}
    <div>
      <h3 className="font-[bold] mb-3">FOLLOW US</h3>
      <ul className="space-y-1 text-[#909090] font-semibold lg:text-sm text-xs ">
        <li>FACEBOOK</li>
        <li>INSTAGRAM</li>
        <li>(X) TWITTER</li>
        <li>TIKTOK</li>
      </ul>
    </div>

    {/* COMPANY */}
    <div>
      <h3 className="font-[bold] mb-3">COMPANY</h3>
      <ul className="space-y-1 text-[#909090] font-semibold lg:text-sm text-xs">
      <Link href={"/contactus"}><li>CONTACT US</li></Link>
      <Link href={"/faq"}><li>FAQ&apos;S</li></Link>
        
        <li>ORDER LOOKUP</li>
        <li>RETURNS</li>
      </ul>
    </div>

    {/* ABOUT US */}
    <div className="lg:justify-self-center">
      <h3 className="font-[bold] mb-3">ABOUT US</h3>
      <ul className="space-y-1 text-[#909090] font-semibold lg:text-sm text-xs">
       <Link href={"/about"}> <li>ABOUT US</li></Link>
        <li>CAREER</li>
        <Link href={"/privacy-policy"}><li>PRIVACY POLICY</li></Link>
        <Link href={"/terms-and-conditions"}> <li>TERMS & CONDITIONS</li></Link>
      </ul>
    </div>

    {/* CONTACT - aligned to right on large screens */}
    <div className="lg:justify-self-end">
      <h3 className="font-[bold] mb-3">CONTACT</h3>
      <ul className="space-y-1 text-[#909090] font-semibold lg:text-sm text-xs">
        <li>help@laibah.se</li>
        <li>+971 23 939 </li>
      </ul>
    </div>
  </div>

  <hr className="border-gray-200" />
  <div className="text-center text-gray-500 py-4 text-xs">
    © 2024 LAIBAH RESERVED ALL RIGHTS 
  </div>
</footer>

  
  );
}
