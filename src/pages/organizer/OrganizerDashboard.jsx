import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { OrganizerEventCard } from "../../components/EventCard";
import { getMyEventsAPI, deleteEventAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const OrganizerDashboard = ({ editEvent }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyEventsAPI();
        setEvents(res.data);
      } catch {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEventAPI(id);
      setEvents((p) => p.filter((e) => e._id !== id));
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const total = events.length;
  const upcoming = events.filter((e) => e.status === "Upcoming").length;
  const completed = events.filter((e) => e.status === "Completed").length;
  const cancelled = events.filter((e) => e.status === "Cancelled").length;

  const filtered = events
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => statusFilter === "All" || e.status === statusFilter);

  const stats = [
    { label: "Total", value: total, border: "border-[#437057]" },
    { label: "Upcoming", value: upcoming, border: "border-[#8aab5a]" },
    { label: "Completed", value: completed, border: "border-green-500" },
    { label: "Cancelled", value: cancelled, border: "border-red-400" },
  ];

  const filters = ["All", "Upcoming", "Completed", "Cancelled"];

  // Check if organizer is verified
  const isVerified = user?.isVerified;

  return (
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Verification warning */}
          {!isVerified && (
            <div className="bg-[#c5d9a0]/30 dark:bg-[#437057]/20 border border-[#8aab5a]/40 dark:border-[#8aab5a]/30 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
              <span className="text-[#437057] dark:text-[#8aab5a] text-xl mt-0.5">
                ⚠️
              </span>
              <div>
                <p className="text-sm font-semibold text-[#437057] dark:text-[#8aab5a]">
                  Account Pending Verification
                </p>
                <p className="text-xs text-[#437057] dark:text-[#8aab5a] mt-0.5">
                  Your organizer account is awaiting admin approval. You can
                  explore the dashboard but cannot create events yet.
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
                My Events
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage all your events
              </p>
            </div>
            {isVerified && (
              <Link to="/organizer/create">
                <button className="bg-[#437057] hover:bg-[#365a46] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                  + Create Event
                </button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-5 border-l-4 ${s.border}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-3xl font-bold text-[#437057] dark:text-white mt-1">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f3329] dark:text-gray-100 px-4 py-2.5 rounded-lg w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a]"
            />
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    statusFilter === f
                      ? "bg-[#437057] text-white border-[#437057]"
                      : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg
                className="animate-spin h-8 w-8 text-[#437057] dark:text-white mb-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Loading events...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {search || statusFilter !== "All"
                  ? "No events found"
                  : "No events yet"}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                {search || statusFilter !== "All"
                  ? "Try adjusting your search or filter"
                  : "Create your first event to get started"}
              </p>
              {!search && statusFilter === "All" && isVerified && (
                <Link to="/organizer/create">
                  <button className="bg-[#437057] hover:bg-[#365a46] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    + Create Event
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <OrganizerEventCard
                  key={event._id}
                  event={event}
                  onDelete={handleDelete}
                  onEdit={editEvent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
