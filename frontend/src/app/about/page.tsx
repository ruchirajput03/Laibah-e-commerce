"use client";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <>
      <Header />

      <div className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[900px] overflow-hidden pt-0 mb-4 lg:pt-0 lg:mb-[40px]">
        <Image
          src="/Rectangle 8.png"
          alt="Banner"
          fill // Use fill instead of width/height for full coverage
          className="object-cover w-full h-full"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center py-6 sm:py-10">
          <h1 className="text-white text-[48px] sm:text-[60px] lg:text-[80px]  lg:leading-[120px] sm:leading-[62px] leading-[50px] font-[bold] uppercase sm:pt-8 lg:mt-0">
            ABOUT US
          </h1>
        </div>
      </div>
      <section className="max-w-3xl mx-auto lg:pt-[80px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">
        <h1 className="text-[#000000] text-[16px] sm:text-3xl lg:text-[40px] leading-extratight lg:leading-[50px] sm:leading-[35px] leading-[22px] font-[bold] uppercase flex text-start justify-center">
          Laibah Trading – Footwear That Fits Every Step
        </h1>
        <p className="max-w-3xl text-[#737373] text-start c mt-4">
          At Laibah Trading, we go beyond selling shoes — we deliver comfort,
          confidence, and quality in every step. Based in the UAE, we specialize
          in stylish, durable, and affordable footwear for men, women, and
          children.
        </p>
      </section>
      <section className="max-w-3xl  mx-auto lg:pt-[40px] pt-[20px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden">
        <h1 className="text-[#000000] text-[16px] sm:text-3xl lg:text-[40px] leading-extratight lg:leading-[50px] sm:leading-[35px] leading-[22px] font-[bold] uppercase flex text-start ">
          Why Choose Laibah Trading?
        </h1>
      </section>
      <section className="max-w-3xl mx-auto lg:px-[40px] px-[20px] lg:mb-[80px] overflow-hidden">
  <ul className="space-y-4 text-sm sm:text-lg lg:text-[16px] lg:leading-[20px] sm:leading-[22px] leading-[16px] text-gray-800 list-disc list-outside pl-5">
    <li>
      <span className="font-semibold text-[#000000]">Trusted by Hundreds of Buyers —</span>
      <span>
        {" "}
        Your reliable source for Camel Safari and more trusted brands — with new collections always on the way.
      </span>
    </li>
    <li>
      <span className="font-semibold text-[#000000]">Competitive Prices —</span>
      <span>
        {" "}
        No Compromise on Quality Wholesale rates and retail affordability to fit every budget.
      </span>
    </li>
    <li>
      <span className="font-semibold text-[#000000]">Speedy Delivery, Near or Far —</span>
      <span>
        {" "}
        We deliver across the UAE and ship internationally with care and efficiency.
      </span>
    </li>
    <li>
      <span className="font-semibold text-[#000000]">Customer-First Service —</span>
      <span>
        {" "}
        We&apos;re not just here to sell — we&apos;re here to serve. WhatsApp, call, or email us anytime.
      </span>
    </li>
  </ul>
</section>


      <Footer/>
    </>
  );
}
