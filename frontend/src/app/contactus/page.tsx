'use client'; // required if you're using Next.js 13+ with app router

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FAQPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    reason: "",
    comment: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : value;
  
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/contactus", formData);
      alert("Message sent successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <section className="max-w-2xl mx-auto lg:pt-[150px] pt-[40px] lg:px-[40px] px-[20px] lg:mb-[40px] mb-4 overflow-hidden ">
        <h2 className="text-center text-xl lg:text-[30px] sm:text-2xl font-[semibold] uppercase">Contact Us</h2>
        <p className="text-center lg:text-[16px] text-[14px] italic mt-2 mb-2">
          Do you need help? You&apos;re in the right place!
        </p>
        <p className="text-center italic text-[#000] font-medium lg:text-[16px] text-[14px]">
          We have created this section to provide you with all<br />
          the assistance you need.
        </p>
        <p className="text-center  text-[#000] font-medium mt-8 lg:text-[16px] text-[14px]">
          If you want, you can also write us directly here.
        </p>

        <form className="mt-10 space-y-6 text-sm" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 px-4 py-2"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full border border-gray-300 px-4 py-2"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full border border-gray-300 px-4 py-2"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full border border-gray-300 px-4 py-2"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="reason"
              className="w-full border border-gray-300 px-4 py-2"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Your Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              name="comment"
              className="w-full border border-gray-300 px-4 py-2 min-h-[120px]"
              maxLength={2000}
              value={formData.comment}
              onChange={handleChange}
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Please enter a maximum of 2,000 characters.</p>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="consent"
              className="mt-1"
              checked={formData.consent}
              onChange={handleChange}
              required
            />
            <label className="text-sm">
              Read the information I consent to the processing of personal data{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <p className="text-xs ">
            {" "}
            <span className="text-red-500">*</span>Required fields
          </p>

          <button
            type="submit"
            className="w-full bg-black text-white uppercase font-semibold py-3 tracking-wider"
          >
            Submit
          </button>
        </form>
      </section>

      <section>
        <div className="w-full lg:pt-[40px] pt-[20px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.601326581791!2d55.3838617!3d25.2839933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5daef38947d9%3A0x493db21d80e84450!2sRAFA%20INTERNATIONAL%20GENERAL%20TRADING%20LLC!5e0!3m2!1sen!2sin!4v1756879749126!5m2!1sen!2sin"
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            className="w-full grayscale"
          ></iframe>
        </div>
      </section>

      <Footer />
    </>
  );
}
