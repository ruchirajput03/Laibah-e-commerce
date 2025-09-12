import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FAQPage() {
    return(
        <>
        <Header/>
        <section className="max-w-3xl mx-auto   lg:pt-[150px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[80px] mb-4 overflow-hidden">
  <h2 className="text-center text-xl sm:text-2xl lg:text-[30px] font-[semibold] text-[#222222] mb-2 uppercase tracking-wide">
    Frequently Asked Questions
  </h2>
  <p className="text-center text-[14px] text-[#373737] mb-10 font-[medium]">
    Please see our Shipping page for a specific FAQ.
  </p>

  <ul className="list-decimal list-outside space-y-6  text-[16px] sm:text-base leading-relaxed pl-5 font-[medium]">
  <li>
    <p className="font-[semibold] text-[#000] mb-1">Can I pay online?</p>
    <p className="text-[#888888]">
      Yes! You can securely pay online. Prefer Pay on Delivery? We offer that across the UAE too. You can also place orders directly via WhatsApp.
    </p>
  </li>

  <li>
    <p className="font-[semibold] text-[#000] mb-1">Do you ship outside the UAE?</p>
    <p className="text-[#888888]">
      Absolutely! We deliver both within the UAE and internationally.
    </p>
  </li>

  <li>
    <p className="font-[semibold] text-[#000] mb-1">Do you have a minimum order for wholesale?</p>
    <p className="text-[#888888]">
      Yes, wholesale orders do require a minimum quantity. Reach out to us for exact details and a catalog.
    </p>
  </li>

  <li>
    <p className="font-[semibold] text-[#000] mb-1">Do I need to create an account to order?</p>
    <p className="text-[#888888]">
      Not at all. You can shop or place wholesale inquiries without any sign-up.
    </p>
  </li>

  <li>
    <p className="font-[semibold] text-[#000] mb-1">Can I order on WhatsApp?</p>
    <p className="text-[#888888]">
      Yes! Just send us a message, and we’ll help you complete your order easily.
    </p>
  </li>

  <li>
    <p className="font-[semibold] text-[#000] mb-1">How long does delivery take?</p>
    <p className="text-[#888888]">
      UAE deliveries are typically fast — within 1–3 working days. International shipping times vary based on location.
    </p>
  </li>
</ul>

</section>
<Footer/>

        </>
    )
}