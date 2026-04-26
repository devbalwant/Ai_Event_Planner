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
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
                My Bookings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                All your event bookings and passes
              </p>
            </div>
            <Link to="/attendee/events">
              <button className="bg-[#437057] hover:bg-[#365a46] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
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
                border: "border-[#437057]",
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
                className={`bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-4 border-l-4 ${s.border}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-[#437057] dark:text-white mt-1">
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
                    ? "bg-[#437057] text-white border-[#437057]"
                    : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                Loading bookings...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-4">
                🎟️
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                No bookings yet
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Browse events and book your first ticket
              </p>
              <Link to="/attendee/events">
                <button className="bg-[#437057] hover:bg-[#365a46] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
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
