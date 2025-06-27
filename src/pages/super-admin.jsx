import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "ADMIN",
  });
  const [isSuper, setIsSuper] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded?.role;
        setIsSuper(role === "SUPER-ADMIN");
        if (role === "SUPER-ADMIN") fetchAdmins();
      } catch (err) {
        console.error("Token decoding failed", err);
      }
    }
  }, []);

  const fetchAdmins = async () => {
    console.log(`Bearer ${localStorage.getItem("token")}`);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admins`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAdmins(res.data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admins`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Admin created!");
      fetchAdmins();
    } catch {
      alert("Failed to create admin");
    }
  };

  const handleDelete = async (username) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admins/${username}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchAdmins();
    } catch {
      alert("Failed to delete admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!isSuper)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm max-w-md w-full">
          <p className="text-xl sm:text-2xl text-red-400 font-semibold">
            Unauthorized Access
          </p>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            You don't have permission to view this page
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative">
      {/* Mobile-optimized header with navigation buttons */}
      <div className="sticky top-0 z-20 bg-black/50 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/map")}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center"
              title="Map"
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
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
              title="Admin"
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
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 text-center flex-1 mx-4">
            Super Admin
          </h1>

          <button
            onClick={handleLogout}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 flex items-center justify-center"
            title="Logout"
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
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 pt-4">
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-base sm:text-lg">
            Manage administrators and system access
          </p>
        </div>

        {/* Create Admin Section - Mobile Optimized */}
        <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-100 flex items-center">
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-2 sm:mr-3 flex items-center justify-center">
              <span className="text-white text-sm sm:text-lg">+</span>
            </span>
            Create New Admin
          </h2>

          <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
            {/* Mobile: Stack all inputs vertically, Desktop: Use grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="w-full p-3 sm:p-4 bg-white/10 border border-gray-600/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="w-full p-3 sm:p-4 bg-white/10 border border-gray-600/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full p-3 sm:p-4 bg-white/10 border border-gray-600/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter secure password"
                  className="w-full p-3 sm:p-4 bg-white/10 border border-gray-600/30 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-gray-300 font-medium mb-2 text-sm sm:text-base">
                  Role
                </label>
                <select
                  className="w-full p-3 sm:p-4 bg-white/10 border border-gray-600/30 rounded-lg sm:rounded-xl text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  value={form.role}
                >
                  <option value="ADMIN" className="bg-gray-800">
                    ADMIN
                  </option>
                  <option value="SUPER-ADMIN" className="bg-gray-800">
                    SUPER-ADMIN
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:from-green-500 hover:to-emerald-600 hover:shadow-green-500/25 transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  Create Admin
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Admin List Section - Mobile Optimized */}
        <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-100 flex items-center">
            <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-2 sm:mr-3 flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm">👥</span>
            </span>
            Administrator List
          </h2>

          {admins.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-base sm:text-lg">
                No administrators found
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.username}
                  className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0 ${
                          admin.role === "SUPER-ADMIN"
                            ? "bg-gradient-to-r from-purple-500 to-pink-600"
                            : "bg-gradient-to-r from-blue-500 to-cyan-600"
                        }`}
                      >
                        {admin.firstName?.charAt(0)}
                        {admin.lastName?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                          {admin.firstName} {admin.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base truncate">
                          @{admin.username}
                        </p>
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                            admin.role === "SUPER-ADMIN"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(admin.username)}
                      className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl hover:from-red-400 hover:to-red-500 hover:shadow-red-500/25 transition-all duration-200 font-medium text-sm sm:text-base flex-shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
