import SignupForm from "@/components/SignupForm";
import Image from "next/image";
export default function SignupPage() {
  return (
    <div className="min-h-screen lg:flex flex-wrap">
      {/* Left: Image */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <Image
          src="/Screenshot 2025-07-15 at 4.50.00 PM.png"
          alt="Puma Shoe"
          width={800}
          height={800}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Signup Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-10">
        <SignupForm />
      </div>
    </div>
  );
}
