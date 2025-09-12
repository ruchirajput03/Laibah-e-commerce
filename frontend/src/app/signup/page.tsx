import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen lg:flex flex-wrap">
      {/* Left: Image */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <img
          src="/Screenshot 2025-07-15 at 4.50.00 PM.png"
          alt="Puma Shoe"
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
