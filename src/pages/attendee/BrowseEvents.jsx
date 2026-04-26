import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AttendeeEventCard } from "../../components/EventCard";
import {
  getPublicEventsAPI,
  bookEventAPI,
  getMyBookingsAPI,
} from "../../services/api";
import toast from "react-hot-toast";

const categories = [
  "All",
  "Wedding",
  "Birthday",
  "Concert",
  "Conference",
  "Workshop",
  "Sports",
  "Festival",
  "Other",
];

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [evRes, bkRes] = await Promise.all([
          getPublicEventsAPI(),
          getMyBookingsAPI(),
        ]);
        setEvents(evRes.data);
        setBookings(bkRes.data);
      } catch {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const bookedEventIds = new Set(
    bookings.filter((b) => b.status === "confirmed").map((b) => b.event?._id),
  );

  const handleBook = async (event) => {
    setBookingId(event._id);
    try {
      const res = await bookEventAPI({ eventId: event._id });
      setBookings((p) => [...p, res.data]);
      toast.success(`Booked! Your pass code: ${res.data.passCode}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  const filtered = events
    .filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((e) => category === "All" || e.category === category);

  return (
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
              Browse Events
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Discover and book upcoming events
            </p>
          </div>

          {/* Search + Category filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search events or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f3329] dark:text-gray-100 px-4 py-2.5 rounded-lg w-full sm:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a]"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    category === c
                      ? "bg-[#437057] text-white border-[#437057]"
                      : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {c}
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
                🔍
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                No events found
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((event) => (
                  <div
                    key={event._id}
                    className={
                      bookingId === event._id
                        ? "opacity-60 pointer-events-none"
                        : ""
                    }
                  >
                    <AttendeeEventCard
                      event={event}
                      onBook={handleBook}
                      isBooked={bookedEventIds.has(event._id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
