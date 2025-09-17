// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post("http://localhost:8080/api/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       router.push("/checkout");
//     } catch (err: any) {
//       const message = err.response?.data?.message || "Login failed";
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md bg-white text-black p-6 rounded-lg shadow-md">
//       <h2 className="text-3xl font-bold">Login Here!</h2>
//       <p className="pt-2 text-gray-500 mb-6">
//         Log in now to explore all the features and benefits of our platform.
//       </p>

//       {error && <p className="text-red-500 font-semibold">{error}</p>}

//       <form className="space-y-5" onSubmit={handleSubmit}>
//         <label className="text-sm">Enter Your Registered Email*</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           placeholder="Enter Your Email"
//           onChange={handleInputChange}
//           className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
//           required
//         />

//         <label className="text-sm">Enter Your Password*</label>
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           placeholder="Enter Your Password"
//           onChange={handleInputChange}
//           className="w-full p-3 border rounded-md bg-gray-100 outline-orange-500"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/authContext";

// type LoginResponse = {
//   user?: {
//     role?: string;
//     // add other user fields if needed
//   };
//   role?: string; // fallback if role is at the root
//   // add other fields if needed
// };

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userInfo = await login(email, password);
      console.log(userInfo, "User info after login");
      // If your login returns just the user, adjust accordingly
      const role = userInfo?.role ;
  
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-8">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-400">Sign in to Laibah</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Sign In"
              )}
            </button>

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

