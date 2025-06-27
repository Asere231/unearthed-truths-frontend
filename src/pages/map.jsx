import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import {
  Menu,
  X,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Archive,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    bibleEra: "",
    region: "",
    type: "",
  });
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token && token.split(".").length === 3) {
        try {
          const decoded = jwtDecode(token);
          const role = decoded?.role;
          setIsAdmin(role === "ADMIN" || role === "SUPER-ADMIN");
        } catch (err) {
          console.error("Token decoding failed", err);
        }
      } else {
        console.warn("No valid token found in localStorage");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Debounced search setter
  const debouncedSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  // Watch typing input and debounce the update
  useEffect(() => {
    debouncedSearch(input);
    return () => debouncedSearch.cancel();
  }, [input]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      bibleEra: "",
      region: "",
      type: "",
    });
    setInput("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.bibleEra || filters.region || filters.type || input;

  return (
    <div className="flex h-screen relative bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Toggle Button - Mobile only */}
      <button
        className="fixed md:hidden top-6 right-6 z-[1015] bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20 hover:bg-white hover:shadow-xl transition-all duration-200 group"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          <X size={20} className="text-slate-700 group-hover:text-slate-900" />
        ) : (
          <Menu
            size={20}
            className="text-slate-700 group-hover:text-slate-900"
          />
        )}
      </button>

      {/* Admin Add Button */}
      {isAdmin && (
        <button
          onClick={() => router.push("/admin")}
          className="fixed bottom-6 right-6 z-[1015] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group transform hover:scale-105"
          aria-label="Add new discovery"
        >
          <Plus
            size={24}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1005] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-96 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl overflow-y-auto transition-all duration-300 ease-out
          md:static md:translate-x-0
          fixed top-0 left-0 h-full z-[1010] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Archaeological Map
                </h1>
                <p className="text-sm text-slate-600">
                  Discover biblical history
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Search
              </h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search discoveries..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Bible Era Filter */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                  Bible Era
                </label>
                <select
                  name="bibleEra"
                  value={filters.bibleEra}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">All Eras</option>
                  <option value="Old Testament">Old Testament</option>
                  <option value="New Testament">New Testament</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  Region
                </label>
                <select
                  name="region"
                  value={filters.region}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">All Regions</option>
                  <option value="Israel">Israel</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Sudan">Sudan</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Archive className="w-4 h-4 mr-2 text-indigo-600" />
                  Discovery Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">All Types</option>
                  <option value="Scroll">Scroll</option>
                  <option value="Inscription">Inscription</option>
                  <option value="Ruin">Ruin</option>
                  <option value="Church">Church</option>
                  <option value="Artifact">Artifact</option>
                  <option value="Altar">Altar</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 p-4 bg-blue-50/80 rounded-xl border border-blue-200/50">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Active Filters:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filters.bibleEra && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {filters.bibleEra}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, bibleEra: "" }))
                        }
                        className="ml-2 hover:text-amber-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.region && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {filters.region}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, region: "" }))
                        }
                        className="ml-2 hover:text-green-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {filters.type}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, type: "" }))
                        }
                        className="ml-2 hover:text-indigo-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {input && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      "{input}"
                      <button
                        onClick={() => setInput("")}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200/50">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              How to Use
            </h3>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Click markers to view detailed information</li>
              <li>• Use filters to narrow down discoveries</li>
              <li>• Search by name or description</li>
              <li>• Tap "Google Earth" for 3D exploration</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Map Content */}
      <main className="flex-grow relative overflow-hidden">
        <div className="h-full rounded-l-2xl md:rounded-none overflow-hidden shadow-2xl">
          <Map filters={filters} search={search} isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  );
}
