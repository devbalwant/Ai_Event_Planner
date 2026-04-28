import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import BookingCard from "../../components/BookingCard";
import { getMyBookingsAPI, cancelBookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyBookingsAPI();
        setBookings(res.data);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBookingAPI(id);
      setBookings((p) =>
        p.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const filtered = bookings.filter((b) => {
    if (filter === "confirmed") return b.status === "confirmed";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#8B1538] dark:text-[#e5e5e5]">
                My Bookings
              </h1>
              <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm mt-1">
                All your event bookings and passes
              </p>
            </div>
            <Link to="/attendee/events">
              <button className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                Browse Events
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
            {[
              {
                label: "Total",
                value: bookings.length,
                border: "border-[#C4A574]",
              },
              {
                label: "Confirmed",
                value: confirmed,
                border: "border-green-500",
              },
              {
                label: "Cancelled",
                value: cancelled,
                border: "border-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`bg-white dark:bg-[#242424] border border-[#C4A574]/30 dark:border-[#333333] rounded-xl p-4 border-l-4 ${s.border}`}
              >
                <p className="text-xs text-[#8B1538]/70 dark:text-[#a3a3a3] font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-[#8B1538] dark:text-[#e5e5e5] mt-1">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {["all", "confirmed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                  filter === f
                    ? "bg-[#C4A574] text-[#0f0f0f] border-[#C4A574] shadow-md"
                    : "bg-white dark:bg-[#242424] text-[#8B1538] dark:text-[#e5e5e5] border-[#C4A574]/30 dark:border-[#333333] hover:border-[#C4A574]/50 dark:hover:border-[#C4A574]/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg
                className="animate-spin h-8 w-8 text-[#C4A574] dark:text-[#C4A574] mb-4"
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
              <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm">
                Loading bookings...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-[#C4A574]/20 dark:bg-[#C4A574]/10 rounded-full flex items-center justify-center text-2xl mb-4">
                🎟️
              </div>
              <h3 className="text-lg font-semibold text-[#8B1538] dark:text-[#e5e5e5] mb-1">
                No bookings yet
              </h3>
              <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm mb-6">
                Browse events and book your first ticket
              </p>
              <Link to="/attendee/events">
                <button className="bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                  Browse Events
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
