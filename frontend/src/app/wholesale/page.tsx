import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
export default function WholesalePage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <Image
          src="/shoes/Group 416.png"
          alt="Wholesale Banner"
          width={1080}
          height={1080}
          className="w-full h-full object-cover"
        />

        {/* Centered Text */}
        <div className="absolute lg:inset-60 inset-25 flex  justify-center text-center">
          <h1 className="text-[#000] lg:text-[55px] font-[bold] uppercase">Wholesale</h1>
        </div>
      </section>

      <section className="max-w-xl mx-auto lg:pt-[80px] pt-[40px] lg:pb-[80px] pb-[40px] lg:px-[40px] px-[20px] overflow-hidden">
  <h1 className="lg:text-[35px] sm:text-[18px] text-[14px] font-[bold] text-center">LAIBAH TRADING</h1>
  <h2 className="lg:text-[35px] sm:text-[18px] text-[14px] font-[bold] text-center">STOCKIST APPLICATION</h2>
  <p className="text-xs text-gray-700 mt-2 text-center lg:text-[16px]">
    If you’re interested in carrying Laibah trading in your physical store, Fill out this form! Our team will typically be in touch within 48 hours.
  </p>

  <form className="mt-6 space-y-4">
    {/* Email */}
    <div>
      <label className="block text-sm font-medium">Email<span className="text-red-500">*</span></label>
      <input
        type="email"
        required
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-sm p-2 outline-none"
      />
    </div>

    {/* Name */}
    <div>
      <label className="block text-sm font-medium">What is your name?<span className="text-red-500">*</span></label>
      <input type="text" required className="w-full border border-gray-300 rounded-sm p-2" />
    </div>

    {/* Store Name */}
    <div>
      <label className="block text-sm font-medium">What is the name of your store?<span className="text-red-500">*</span></label>
      <input type="text" required className="w-full border border-gray-300 rounded-sm p-2" />
    </div>

    {/* Store Address */}
    <div>
      <label className="block text-sm font-medium">What is your store’s address?<span className="text-red-500">*</span></label>
      <input type="text" required className="w-full border border-gray-300 rounded-sm p-2" />
    </div>

    {/* Website (Optional) */}
    <div>
      <label className="block text-sm font-medium">What is your business website? (Optional)</label>
      <input type="url" className="w-full border border-gray-300 rounded-sm p-2" />
    </div>

    {/* Social Media (Optional) */}
    <div>
      <label className="block text-sm font-medium">Please list any social media links for your business. (Optional)</label>
      <input type="text" className="w-full border border-gray-300 rounded-sm p-2" />
    </div>

    {/* Product Interest */}
    <div>
      <label className="block text-sm font-medium mb-1">Which products are you most interested in carrying?</label>
      <div className="space-y-1 text-sm">
        <label className="block"><input type="checkbox" className="mr-2" />Sports Shoes (Men & Women)</label>
        <label className="block"><input type="checkbox" className="mr-2" />Casual Shoes (Men & Women)</label>
        <label className="block"><input type="checkbox" className="mr-2" />Slippers (Men & Women)</label>
        <label className="block"><input type="checkbox" className="mr-2" />Belts (Men & Women)</label>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-black text-white text-sm px-6 py-2 rounded hover:bg-gray-800"
    >
      Submit
    </button>
  </form>
</section>


      <Footer />
    </>
  );
}
