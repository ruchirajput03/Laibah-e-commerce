"use client"
import LoginForm from "../../components/login";
import Image from "next/image";
export default function LoginPage() {
  return (
    <div className="lg:min-h-screen lg:flex">
      {/* Left: Image */}
      <div className="lg:w-1/2 w-full bg-black lg:flex items-center justify-center lg:block hidden">
        <Image
          src="/Screenshot 2025-07-15 at 4.50.00 PM.png" 
          alt="Puma Shoe"
          width={800}
          height={800}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Login Form */}
      <div className="lg:w-1/2 w-full bg-white flex  items-center justify-center lg:pt-0 pt-10">
        <LoginForm />
      </div>
    </div>
  );
}
