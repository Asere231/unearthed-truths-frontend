import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function AdminPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    bibleEra: "",
    region: "",
    type: "",
    sourceLink: "",
  });
  // const [file, setFile] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discovery`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Discovery submitted!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token && token.split(".").length === 3) {
        try {
          const decoded = jwtDecode(token);
          const role = decoded?.role;
          setIsSuper(role === "SUPER-ADMIN");
        } catch (err) {
          console.error("Token decoding failed", err);
        }
      } else {
        console.warn("No valid token found in localStorage");
      }
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen relative overflow-hidden bg-cover bg-center p-3 sm:p-4 md:p-6"
      style={{ backgroundImage: "url('/pisit-heng-ci1F55HaVWQ-unsplash.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 z-0" />

      {/* Mobile-Friendly Navigation */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20 sm:top-4 sm:left-4 sm:right-4 md:top-6 md:left-6 md:right-6">
        {/* Back to Map Button */}
        <button
          onClick={() => router.push("/map")}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 hover:shadow-gray-500/25 transition-all duration-200 group touch-manipulation"
          title="Back to Map"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:from-red-500 hover:to-red-600 hover:shadow-red-500/25 transition-all duration-200 group touch-manipulation"
          title="Logout"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* Super Admin Button - Mobile Positioned */}
      {isSuper && (
        <button
          onClick={() => router.push("/super-admin")}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 rounded-full sm:rounded-xl shadow-lg hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/25 transition-all duration-200 group touch-manipulation"
          title="Super Admin Panel"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      )}

      {/* Main Content Container */}
      <div className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl z-10 border border-white/20 mt-16 sm:mt-20 mb-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">
            Upload New Discovery
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-2 sm:mt-3 text-sm sm:text-base">
            Add archaeological findings to the database
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Title Input - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Discovery Title
              </label>
              <input
                type="text"
                placeholder="Enter discovery title"
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Description
              </label>
              <textarea
                placeholder="Detailed description of the discovery"
                rows="3"
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 resize-none text-sm sm:text-base touch-manipulation"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              ></textarea>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Latitude
              </label>
              <input
                type="text"
                placeholder="e.g., 31.7683"
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Longitude
              </label>
              <input
                type="text"
                placeholder="e.g., 35.2137"
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />
            </div>

            {/* Bible Era */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Bible Era
              </label>
              <select
                value={form.bibleEra}
                onChange={(e) => setForm({ ...form, bibleEra: e.target.value })}
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
              >
                <option value="" className="bg-gray-800">
                  Select Era
                </option>
                <option value="Old Testament" className="bg-gray-800">
                  Old Testament
                </option>
                <option value="New Testament" className="bg-gray-800">
                  New Testament
                </option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Region
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
              >
                <option value="" className="bg-gray-800">
                  Select Region
                </option>
                <option value="Israel" className="bg-gray-800">
                  Israel
                </option>
                <option value="Egypt" className="bg-gray-800">
                  Egypt
                </option>
                <option value="Babylon" className="bg-gray-800">
                  Babylon
                </option>
                <option value="Jerusalem" className="bg-gray-800">
                  Jerusalem
                </option>
              </select>
            </div>

            {/* Discovery Type */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Discovery Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
              >
                <option value="" className="bg-gray-800">
                  Select Type
                </option>
                <option value="Scroll" className="bg-gray-800">
                  Scroll
                </option>
                <option value="Inscription" className="bg-gray-800">
                  Inscription
                </option>
                <option value="Ruin" className="bg-gray-800">
                  Ruin
                </option>
                <option value="Church" className="bg-gray-800">
                  Church
                </option>
                <option value="Artifact" className="bg-gray-800">
                  Artifact
                </option>
                <option value="Altar" className="bg-gray-800">
                  Altar
                </option>
              </select>
            </div>

            {/* Source Link */}
            <div>
              <label className="block text-gray-200 font-medium mb-2 text-sm sm:text-base">
                Source Link
              </label>
              <input
                type="url"
                placeholder="https://example.com/source"
                className="w-full p-3 sm:p-4 bg-white/10 border border-gray-500/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base touch-manipulation"
                onChange={(e) =>
                  setForm({ ...form, sourceLink: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white font-bold py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl shadow-2xl border border-amber-500/30 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 hover:shadow-amber-500/25 active:scale-95 transition-all duration-300 ease-out touch-manipulation"
          >
            <span className="text-base sm:text-lg tracking-wide">
              Submit Discovery
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
