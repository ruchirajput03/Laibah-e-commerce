"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, contact, email, password, confirmPassword, role } = formData;

    if (!name || !contact || !email || !password || !confirmPassword) {
      setLocalError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError("");
    setLoading(true);

    try {
      const result = await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        contact,
        email,
        password,
        role,
      });

      const { token } = result.data;
      localStorage.setItem("token", token);

      router.push("/checkout");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setLocalError(err.response.data.message);
      } else {
        setLocalError("Signup failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md text-black">
      <h2 className="text-3xl font-bold mb-4">Create an Account</h2>
      <p className="text-gray-600 mb-8">
        Join us to unlock the full experience and start exploring today!
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {localError && (
          <div className="text-red-500 font-medium">{localError}</div>
        )}

        <div>
          <label className="block text-md font-medium mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-1">Contact*</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-1">Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create password"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          />
        </div>

        <div>
          <label className="block text-md font-medium mb-1">
            Confirm Password*
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-orange-500 font-medium hover:underline">
          Log In
        </a>
      </p>
    </div>
  );
}
