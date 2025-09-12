import React from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';

const TermsAndConditions = () => {
  return (
    <>
    <Header/>
      <Head>
        <title>Terms & Conditions</title>
      </Head>
      <div className="max-w-5xl mx-auto lg:pt-[120px] pt-[80px] lg:mb-[80px] mb-[40px] lg:px-[40px] px-[20px] text-[#000000]">
        <h1 className="text-3xl font-[bold] mb-6   text-center">TERMS & CONDITIONS</h1>

        <p className="mb-4 font-[regular]"><strong>Effective Date:</strong> 8 July 2025</p>
        <p className="mb-6  font-[regular] "><strong>Last Updated:</strong> 8 July 2025</p>

        <p className="mb-6  font-[regular] ">
          Welcome to <a href="https://www.alsibah.ae/" className="text-blue-600 underline">https://www.alsibah.ae/</a>! These Terms & Conditions govern your use of our website and services. By accessing or placing an order with us, you agree to be bound by these terms.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">1. Eligibility</h2>
        <p className="mb-6  font-[regular]">
          You must be at least 18 years old or have permission from a parent/guardian to use our website and make purchases.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">2. Products</h2>
        <p className="mb-6   font-[regular]">
          We strive to display accurate product images and descriptions. However, colors may vary slightly due to screen settings. Sizes and availability are subject to change.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">3. Orders & Payments</h2>
        <ul className="list-disc list-inside mb-6   space-y-1  font-[regular]">
          <li>All prices are listed in AED.</li>
          <li>We reserve the right to cancel or refuse any order.</li>
          <li>Payments must be made using the listed payment options at checkout.</li>
          <li>Fraudulent or suspicious transactions may be blocked or reported.</li>
        </ul>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">4. Shipping & Delivery</h2>
        <ul className="list-disc list-inside mb-6  space-y-1  font-[regular]">
          <li>Delivery timelines are estimates and may vary.</li>
          <li>We are not liable for delays due to courier issues, weather, or other factors beyond our control.</li>
          <li>Shipping fees (if any) are disclosed during checkout.</li>
        </ul>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">5. Returns & Exchanges</h2>
        <p className="mb-6  font-[regular]  ">
          Please refer to our <a href="/return-policy" className="text-blue-600 underline">Return Policy</a> for details on returns, exchanges, and refund eligibility. Items must be returned unworn, in original packaging, and within the specified return window.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">6. Intellectual Property</h2>
        <p className="mb-6  font-[regular]  ">
          All content on our website, including text, images, logos, and graphics, is owned by 
          <a href="https://www.alsibah.ae/" className="text-blue-600 underline"> https://www.alsibah.ae/</a> and protected by copyright laws. 
          You may not reproduce, distribute, or use our content without written permission.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">7. Limitation of Liability</h2>
        <p className="mb-6  font-[regular]">
          We are not liable for indirect, incidental, or consequential damages arising from your use of the website or products purchased.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">8. Governing Law</h2>
        <p className="mb-6  font-[regular]">
          These Terms shall be governed and construed in accordance with the laws of <strong>DUBAI/UAE</strong>, without regard to conflict of law provisions.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">9. Changes to Terms</h2>
        <p className="mb-6  font-[regular]">
          We reserve the right to update these Terms at any time. Continued use of the site after changes means you accept the revised terms.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">10. Contact Information</h2>
        <p className="mb-1  font-[regular]">For questions, support, or complaints:</p>
        <p className="mb-1  font-[regular]">Email: <a href="mailto:help@alsibah.ae" className="text-blue-600 underline  font-[regular]">help@alsibah.ae</a></p>
        <p className=' font-[regular]'>Phone: +971 52 939 1867</p>
      </div>
      <Footer/>
    </>
  );
};

export default TermsAndConditions;
