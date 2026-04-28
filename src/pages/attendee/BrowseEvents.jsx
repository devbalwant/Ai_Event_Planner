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
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#8B1538] dark:text-[#e5e5e5]">
              Browse Events
            </h1>
            <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm mt-1">
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
              className="border border-[#C4A574]/30 dark:border-[#333333] bg-white dark:bg-[#242424] dark:text-[#e5e5e5] px-4 py-2.5 rounded-lg w-full sm:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/40 focus:border-[#C4A574] placeholder:text-[#8B1538]/40 dark:placeholder:text-[#a3a3a3]"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    category === c
                      ? "bg-[#C4A574] text-[#0f0f0f] border-[#C4A574] shadow-md"
                      : "bg-white dark:bg-[#242424] text-[#8B1538] dark:text-[#e5e5e5] border-[#C4A574]/30 dark:border-[#333333] hover:border-[#C4A574]/50 dark:hover:border-[#C4A574]/40"
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
                Loading events...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-[#C4A574]/20 dark:bg-[#C4A574]/10 rounded-full flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-[#8B1538] dark:text-[#e5e5e5] mb-1">
                No events found
              </h3>
              <p className="text-[#8B1538]/70 dark:text-[#a3a3a3] text-sm">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#8B1538]/70 dark:text-[#a3a3a3] mb-4">
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
