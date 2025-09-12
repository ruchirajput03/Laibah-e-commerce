"use client";

export default function LoginForm() {
  


  return (

    <div className="w-full max-w-md text-black">
      <h2 className="text-3xl font-bold mb-4 ">Welcome Back!</h2>
      <p className="text-gray-600 mb-8">
        Log in now to explore all the features and benefits of our platform and see what's new.
      </p>

      <form className="space-y-5">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          defaultValue="ruchi@gmail.com"
        />

        <div className="relative">
          <input
            type="password"
            placeholder="Enter your Password"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
            defaultValue="password"
          />
          {/* 👁 icon can be added here if needed */}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember my account
          </label>
          <a href="#" className="text-orange-500 hover:underline">Forgot Password?</a>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold"
         >
          Login
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-orange-500 font-medium hover:underline">
          Register Now
        </a>
      </p>
    </div>
  );
}
