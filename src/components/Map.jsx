// components/Map.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ExternalLink,
  Globe,
  Edit3,
  MapPin,
  Calendar,
  Archive,
  Trash2,
  Save,
  X,
} from "lucide-react";
import {
  GiScrollUnfurled,
  GiRuneStone,
  GiAncientRuins,
  GiGlowingArtifact,
  GiStarAltar,
} from "react-icons/gi";
import { PiChurchDuotone } from "react-icons/pi";
import { ImSphere } from "react-icons/im";

/**
 * Creates a custom tooltip-style marker icon for map markers
 * @param {string} text - The text to display in the tooltip
 * @returns {L.DivIcon} - Leaflet DivIcon instance
 */
function createTooltipIcon(text) {
  return new L.DivIcon({
    html: `
      <div style="
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 8px 16px;
        font-weight: 600;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        position: relative;
        white-space: nowrap;
        transform: translateX(-50%);
        border: 2px solid white;
        backdrop-filter: blur(10px);
      ">
        ${text}
        <div style="
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid #667eea;
        "></div>
      </div>
    `,
    className: "",
    iconAnchor: [0, 45],
    popupAnchor: [0, -45],
  });
}

/**
 * Creates a simple dot marker icon for when popup is open
 * @returns {L.DivIcon} - Leaflet DivIcon instance
 */
function createDotIcon() {
  return new L.DivIcon({
    html: '<div style="width: 16px; height: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>',
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
}

/**
 * Main Map component for displaying archaeological findings
 * @param {Object} filters - Current filter settings (bibleEra, region, type)
 * @param {string} search - Search query string
 * @param {boolean} isAdmin - Whether current user has admin privileges
 */
export default function Map({ filters, search, isAdmin }) {
  // Static findings data (replace with API call when backend is ready)
  // const findings = [
  //   {
  //     id: "static1",
  //     title: "Hezekiah's Tunnel",
  //     description:
  //       "An ancient water tunnel in Jerusalem, built by King Hezekiah during the Bronze Age.",
  //     latitude: 31.7767,
  //     longitude: 35.2345,
  //     imageUrl:
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Siloam_Tunnel_2010.jpg/640px-Siloam_Tunnel_2010.jpg",
  //     sourceLink: "https://en.wikipedia.org/wiki/Siloam_tunnel",
  //     bibleEra: "Bronze Age",
  //     region: "Jerusalem",
  //     type: "Altar",
  //   },
  // ];

  // State management for component functionality
  const [findings, setFindings] = useState([]);
  const [openPopupId, setOpenPopupId] = useState(null); // Currently open popup ID
  const [editingFinding, setEditingFinding] = useState(null); // Finding being edited
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    bibleEra: "",
    region: "",
    type: "",
    sourceLink: "",
    latitude: "",
    longitude: "",
  }); // Edit form data
  const [isMobile, setIsMobile] = useState(false); // Mobile detection
  const [isDeleting, setIsDeleting] = useState(false); // Delete confirmation state

  // Effect to detect mobile devices and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Effect to log search changes for debugging
  useEffect(() => {
    console.log("Received search value in Map.jsx:", search);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api`;
        const params = new URLSearchParams();

        const hasFilters =
          (filters.bibleEra && filters.bibleEra !== "All") ||
          (filters.region && filters.region !== "All") ||
          (filters.type && filters.type !== "All") ||
          (search && search.trim() !== "");

        if (hasFilters) {
          url += "/discoveries/filters";
          if (filters.bibleEra && filters.bibleEra !== "All") {
            console.log("Filter: " + filters.bibleEra);
            params.append("bibleEra", filters.bibleEra);
          }
          if (filters.region && filters.region !== "All") {
            console.log("Filter: " + filters.region);
            params.append("region", filters.region);
          }
          if (filters.type && filters.type !== "All") {
            console.log("Filter: " + filters.type);
            params.append("type", filters.type);
          }
          if (search && search.trim() !== "") {
            params.append("query", search);
          }
        } else {
          url += "/discoveries";
        }

        // if ([...params].length > 0) {
        //   url += "/discoveries/search?" + params.toString();
        // }

        if (params.toString().length > 0) {
          console.log("Full request URL:", url + "?" + params.toString());
          const res = await axios.get(url, { params });
          setFindings(res.data);
        } else {
          console.log("Requesting without params:", url);
          const res = await axios.get(url);
          setFindings(res.data);
        }
      } catch (err) {
        console.error("Error fetching discoveries:", err);
      }
    };
    fetchData();
  }, [filters]);

  useEffect(() => {
    const searchDiscoveries = async () => {
      try {
        let res;

        if (!search.trim()) {
          // If search is empty, get all discoveries
          const url = `${process.env.NEXT_PUBLIC_API_URL}/api/discoveries`;
          console.log("Fetching all discoveries:", url);
          res = await axios.get(url);
        } else {
          // Otherwise, search
          const url = `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/discoveries/search?query=${encodeURIComponent(search.trim())}`;
          console.log("Search URL:", url);
          res = await axios.get(url);
        }

        setFindings(res.data);
      } catch (err) {
        console.error("Error during search:", err);
      }
    };

    searchDiscoveries();
  }, [search]);

  /**
   * Returns appropriate icon component for finding type
   * @param {string} type - The type of archaeological finding
   * @returns {JSX.Element} - Corresponding Lucide icon
   */
  const getTypeIcon = (type) => {
    const iconMap = {
      Scroll: GiScrollUnfurled,
      Inscription: GiRuneStone,
      Ruin: GiAncientRuins,
      Artifact: GiGlowingArtifact,
      Altar: GiStarAltar,
      Church: PiChurchDuotone,
    };
    const IconComponent = iconMap[type] || Archive;
    return <IconComponent className="w-4 h-4" />;
  };

  /**
   * Handles opening edit modal for a finding
   * @param {Object} finding - The finding object to edit
   */
  const handleEdit = (finding) => {
    console.log("Editing finding with ID:", finding.id);
    setEditingFinding(finding);
    // Pre-populate edit form with current data
    setEditData({
      title: finding.title,
      description: finding.description,
      bibleEra: finding.bibleEra,
      region: finding.region,
      type: finding.type,
      sourceLink: finding.sourceLink,
      latitude: finding.latitude.toString(),
      longitude: finding.longitude.toString(),
    });
  };

  /**
   * Closes the edit modal and resets state
   */
  const closeModal = () => {
    setEditingFinding(null);
    setEditData({
      title: "",
      description: "",
      bibleEra: "",
      region: "",
      type: "",
      sourceLink: "",
      latitude: "",
      longitude: "",
    });
    setIsDeleting(false);
  };

  /**
   * Handles form field changes in edit modal
   * @param {Event} e - Input change event
   */
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Saves edited finding data to backend
   */
  const handleSave = async () => {
    if (!editingFinding) return;

    try {
      // Convert lat/lng back to numbers
      const updatedData = {
        ...editData,
        latitude: parseFloat(editData.latitude),
        longitude: parseFloat(editData.longitude),
      };

      // Send PUT request to update finding
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/${editingFinding.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state with new data
      // Note: This would work with dynamic findings array
      setFindings((prev) =>
        prev.map((f) =>
          f.id === editingFinding.id ? { ...f, ...updatedData } : f
        )
      );

      console.log("Finding updated successfully");
    } catch (err) {
      console.error("Failed to save edits:", err);
    } finally {
      closeModal();
    }
  };

  /**
   * Handles finding deletion
   */
  const handleDelete = async () => {
    if (!editingFinding) return;

    try {
      // Send DELETE request to remove finding
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/${editingFinding.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state to remove finding
      // Note: This would work with dynamic findings array
      setFindings((prev) => prev.filter((f) => f.id !== editingFinding.id));

      console.log("Finding deleted successfully");
    } catch (err) {
      console.error("Failed to delete finding:", err);
    } finally {
      closeModal();
    }
  };

  /**
   * Handles backdrop click to close modal on mobile
   * @param {Event} e - Click event
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Main map container */}
      <MapContainer
        center={[31.7683, 35.2137]} // Center on Jerusalem
        zoom={isMobile ? 12 : 13} // Slightly zoomed out on mobile
        style={{ height: "100%", width: "100%" }}
        zoomControl={!isMobile} // Hide zoom controls on mobile (use touch gestures)
      >
        {/* Map tile layer using Esri street map */}
        <TileLayer
          attribution="Tiles &copy; Esri — Source: Esri, HERE, Garmin"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Render markers for each finding */}
        {findings.map((finding) => (
          <Marker
            key={finding.id}
            position={[finding.latitude, finding.longitude]}
            // Switch between tooltip and dot icon based on popup state
            icon={
              openPopupId === finding.id
                ? createDotIcon()
                : createTooltipIcon(finding.title)
            }
            eventHandlers={{
              // Track which popup is open
              popupopen: () => setOpenPopupId(finding.id),
              popupclose: () => setOpenPopupId(null),
            }}
          >
            {/* Modern popup design */}
            <Popup
              maxWidth={isMobile ? 280 : 320}
              className="custom-popup"
              closeButton={true}
            >
              <div
                className={`
                ${isMobile ? "p-3" : "p-4"} 
                font-sans 
                bg-gradient-to-br from-slate-50 to-blue-50 
                rounded-lg 
                shadow-lg
                ${isMobile ? "text-sm" : ""}
              `}
              >
                {/* Finding title */}
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className={`
                    font-bold 
                    text-slate-800 
                    leading-tight
                    ${isMobile ? "text-lg" : "text-xl"}
                  `}
                  >
                    {finding.title}
                  </h3>
                </div>

                {/* Era badge */}
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {finding.bibleEra}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={`
                  text-slate-600 
                  leading-relaxed 
                  mb-4
                  ${isMobile ? "text-sm" : ""}
                `}
                >
                  {finding.description}
                </p>

                {/* Metadata grid */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {/* <div className="flex items-center text-slate-700">
                    <ImSphere className="w-4 h-4 mr-2" />
                    <span className="font-semibold">
                      {finding.latitude} {finding.longitude}
                    </span>
                  </div> */}

                  {(() => {
                    const lat = parseFloat(finding.latitude);
                    const lng = parseFloat(finding.longitude);

                    // Convert to degrees, minutes, seconds
                    const toDMS = (decimal) => {
                      const abs = Math.abs(decimal);
                      const degrees = Math.floor(abs);
                      const minutes = Math.floor((abs - degrees) * 60);
                      const seconds = (
                        (abs - degrees - minutes / 60) *
                        3600
                      ).toFixed(1);
                      return `${degrees}° ${minutes}' ${seconds}"`;
                    };

                    return (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <ImSphere className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm font-semibold text-slate-700">
                              Coordinates
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(`${lat}, ${lng}`)
                            }
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                          >
                            Copy
                          </button>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">
                              Decimal:
                            </span>
                            <span className="font-mono text-slate-800">
                              {lat.toFixed(6)}, {lng.toFixed(6)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">
                              DMS:
                            </span>
                            <span className="font-mono text-slate-800 text-xs">
                              {toDMS(lat)}
                              {lat >= 0 ? "N" : "S"}, {toDMS(lng)}
                              {lng >= 0 ? "E" : "W"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center text-slate-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{finding.region}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    {getTypeIcon(finding.type)}
                    <span className="font-semibold ml-2">{finding.type}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className={`
                  flex flex-col gap-2
                  ${!isMobile ? "sm:flex-row" : ""}
                `}
                >
                  <button
                    onClick={() => window.open(finding.sourceLink, "_blank")}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-blue-600 hover:text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    More Info
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `https://earth.google.com/web/@${finding.latitude},${finding.longitude},5000a`,
                        "_blank"
                      )
                    }
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-green-600 hover:text-green-700 text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Google Earth
                  </button>

                  {/* Admin edit button */}
                  {isAdmin && (
                    <button
                      onClick={() => handleEdit(finding)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-purple-600 hover:text-purple-700 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Edit Modal - Improved design and mobile-friendly */}
      {editingFinding && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4"
          onClick={handleBackdropClick}
        >
          <div
            className={`
            bg-white 
            rounded-xl 
            shadow-2xl 
            w-full 
            max-w-md 
            max-h-[90vh] 
            overflow-y-auto
            transform 
            transition-all 
            duration-300 
            scale-100
            ${isMobile ? "mx-4" : ""}
          `}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {isDeleting ? "Delete Finding" : "Edit Finding"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">
              {isDeleting ? (
                /* Delete confirmation */
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete Finding
                  </h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{editingFinding?.title}"?
                    This action cannot be undone.
                  </p>
                </div>
              ) : (
                /* Edit form */
                <>
                  {/* Title field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Finding Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleFieldChange}
                      placeholder="Enter finding title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  {/* Description field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleFieldChange}
                      placeholder="Enter detailed description..."
                      rows={isMobile ? 3 : 4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
                    />
                  </div>

                  {/* Bible Era and Region row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bible Era
                      </label>
                      <select
                        name="bibleEra"
                        value={editData.bibleEra}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900"
                      >
                        <option value="">Select Era</option>
                        <option value="Old Testament">Old Testament</option>
                        <option value="New Testament">New Testament</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={editData.region}
                        onChange={handleFieldChange}
                        placeholder="Enter region..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Type field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={editData.type}
                      onChange={handleFieldChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900"
                    >
                      <option value="">Select Type</option>
                      <option value="Scroll">Scroll</option>
                      <option value="Inscription">Inscription</option>
                      <option value="Ruin">Ruin</option>
                      <option value="Artifact">Artifact</option>
                      <option value="Altar">Altar</option>
                      <option value="Church">Church</option>
                    </select>
                  </div>

                  {/* Coordinates row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={editData.latitude}
                        onChange={handleFieldChange}
                        placeholder="Enter latitude..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={editData.longitude}
                        onChange={handleFieldChange}
                        placeholder="Enter longitude..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Source Link field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Source Link
                    </label>
                    <input
                      type="url"
                      name="sourceLink"
                      value={editData.sourceLink}
                      onChange={handleFieldChange}
                      placeholder="Enter source URL..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {isDeleting ? (
                /* Delete confirmation buttons */
                <>
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Finding
                  </button>
                </>
              ) : (
                /* Edit form buttons */
                <>
                  <button
                    onClick={() => setIsDeleting(true)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <div className="flex flex-col-reverse sm:flex-row gap-3 flex-1">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={
                        !editData.title.trim() || !editData.description.trim()
                      }
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
