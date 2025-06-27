import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        {
          username,
          password,
        }
      );

      if (res.data && res.data.token) {
        console.log("Token in login: " + res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        console.log("Invalid token in login");
      }
      router.push("/map");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/pisit-heng-ci1F55HaVWQ-unsplash.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 hover:border-amber-400/30 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">
            Admin Portal
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-3 text-sm">
            Secure access to discovery management
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-xl mb-6 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-200 font-medium mb-2 block">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-200 font-medium mb-2 block">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200"
              placeholder="Enter your password"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl border border-amber-500/30 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 hover:shadow-amber-500/25 active:scale-95 transition-all duration-300 ease-out"
        >
          <span className="text-lg tracking-wide">Access Dashboard</span>
        </button>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-200"
          >
            ← Back to Main Site
          </a>
        </div>
      </form>
    </div>
  );
}
