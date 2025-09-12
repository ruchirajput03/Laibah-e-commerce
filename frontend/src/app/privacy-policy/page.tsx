import React from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';

const PrivacyPolicy = () => {
  return (
    <>
    <Header/>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <div className="max-w-5xl mx-auto lg:pt-[120px] pt-[80px] lg:mb-[80px] mb-[40px] lg:px-[40px] px-[20px] text-[#000000]">
        <h1 className="text-3xl font-[bold] mb-6 text-center">PRIVACY POLICY</h1>

        <p className="mb-4"><strong className=' font-[medium]'>Effective Date:</strong> 8 July 2025</p>
        <p className="mb-6"><strong  className=' font-[medium]'>Last Updated:</strong> 8 July 2025</p>

        <p className="mb-4 font-[regular]">
          At Your Website Name, accessible from <a href="https://www.alsibah.ae/" className="text-blue-600 underline">https://www.alsibah.ae/</a>, your privacy is one of our top priorities. 
          This Privacy Policy document outlines the types of information that is collected and recorded by 
          <a href="https://www.alsibah.ae/" className="text-blue-600 underline"> https://www.alsibah.ae/</a> and how we use it.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">1. Information We Collect</h2>
        <p className="mb-2 font-[regular]">We collect personal information when you:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 font-[regular]">
          <li>Register an account</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact customer support</li>
        </ul>

        <p className="text-xl font-[semibold] mt-8 mb-2">The personal data may include:</p>
        <ul className="list-disc list-inside mb-6 space-y-1 font-[regular]">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping/billing address</li>
          <li>Payment details (processed via secure third-party gateways)</li>
          <li>IP address and device/browser information</li>
        </ul>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">2. How We Use Your Information</h2>
        <p className="mb-2 font-[regular]">We use the collected data to:</p>
        <ul className="list-disc list-inside mb-6 space-y-1 font-[regular]">
          <li>Process and ship your orders</li>
          <li>Personalize your shopping experience</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Provide customer support</li>
          <li>Send promotional emails (with your consent)</li>
        </ul>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">3. Sharing Your Information</h2>
        <p className="mb-2 font-[regular]">
          We do not sell or trade your personal information. We may share data with trusted third parties like:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-1 font-[regular]">
          <li>Payment processors</li>
          <li>Delivery and logistics partners</li>
          <li>Marketing and email service providers (only if opted in)</li>
        </ul>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">4. Cookies</h2>
        <p className="mb-6 font-[regular]">
          We use cookies to enhance your experience, analyze site traffic, and offer personalized ads.
          You can control cookies through your browser settings.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">5. Data Security</h2>
        <p className="mb-6 font-[regular]">
          We take reasonable steps to protect your information using encryption, secure servers, and regular security assessments.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">6. Your Rights</h2>
        <p className="mb-2 font-[regular]">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside mb-2 space-y-1 font-[regular]">
          <li>Access your personal data</li>
          <li>Correct inaccuracies</li>
          <li>Delete your information</li>
          <li>Withdraw consent</li>
        </ul> fo
        <p className="mb-6 font-[regular]">
          You may exercise these rights by contacting us at 
          <a href="mailto:support@yourwebsite.com" className="text-blue-600 underline"> support@yourwebsite.com</a>.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">7. Changes to This Policy</h2>
        <p className="mb-6 font-[regular]">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised date.
        </p>

        <h2 className="text-xl font-[semibold] mt-8 mb-2">8. Contact Us</h2>
        <p className="mb-1 font-[regular]">For questions or requests regarding your data, contact:</p>
        <p className="mb-1 font-[regular]">Email: <a href="mailto:help@alsibah.ae" className="text-blue-600 underline">help@alsibah.ae</a></p>
        <p className='font-[regular]'>Phone: +971 52 939 1867</p>
      </div>
      <Footer/>
    </>
  );
};

export default PrivacyPolicy;
