import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getEventByIdAPI, bookEventAPI } from "../../services/api";
import toast from "react-hot-toast";

const SERVICE_FEE_PERCENT = 10; // 10% service fee

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEventByIdAPI(id);
        setEvent(res.data);
      } catch {
        toast.error("Event not found");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const subtotal = event ? Number(event.ticketPrice) * quantity : 0;
  const serviceFee = Math.round((subtotal * SERVICE_FEE_PERCENT) / 100);
  const total = subtotal + serviceFee;

  const handleBook = async () => {
    setBooking(true);
    try {
      const res = await bookEventAPI({ eventId: id, quantity });
      toast.success(`Booking confirmed! Pass code: ${res.data.passCode}`);
      navigate("/attendee/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center py-24">
            <svg
              className="animate-spin h-8 w-8 text-[#C4A574] dark:text-[#C4A574]"
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
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#8B1538]/70 dark:text-[#a3a3a3] hover:text-[#8B1538] dark:hover:text-[#e5e5e5] mb-6 transition-colors"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-[#8B1538] dark:text-[#e5e5e5] mb-7">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
            {/* Left — Event details + ticket selector */}
            <div className="lg:col-span-2 space-y-5">
              {/* Event Details Card */}
              <div className="bg-white dark:bg-[#242424] border border-[#C4A574]/30 dark:border-[#333333] rounded-2xl p-6 shadow-lg">
                <h2 className="text-sm font-semibold text-[#8B1538] dark:text-[#e5e5e5] mb-4">
                  Event Details
                </h2>
                <div className="flex gap-4">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      🎪
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.location}
                    </p>
                    {event.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.date}
                        {event.time ? ` • ${event.time}` : ""}
                      </p>
                    )}
                    {event.category && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 mt-2 inline-block">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Select Tickets */}
              <div className="bg-white dark:bg-[#242424] border border-[#C4A574]/30 dark:border-[#333333] rounded-2xl p-6 shadow-lg">
                <h2 className="text-sm font-semibold text-[#8B1538] dark:text-[#e5e5e5] mb-4">
                  Select Tickets
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      General Admission
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      ₹{Number(event.ticketPrice).toLocaleString()} per ticket
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="text-base font-bold text-gray-900 dark:text-gray-100 w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => {
                          if (event.capacity && q >= event.capacity) return q;
                          return q + 1;
                        })
                      }
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                {event.capacity && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    Max capacity: {event.capacity} seats
                  </p>
                )}
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#242424] border border-[#C4A574]/30 dark:border-[#333333] rounded-2xl p-6 sticky top-24 shadow-lg">
                <h2 className="text-sm font-semibold text-[#8B1538] dark:text-[#e5e5e5] mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>
                      Subtotal ({quantity} ticket{quantity > 1 ? "s" : ""})
                    </span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Service Fee ({SERVICE_FEE_PERCENT}%)</span>
                    <span>₹{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-100 text-base">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="mt-6 w-full bg-[#C4A574] hover:bg-[#B09560] disabled:bg-gray-300 text-[#0f0f0f] py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {booking ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
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
                      Booking...
                    </>
                  ) : (
                    <>🎟️ Book Now</>
                  )}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                  Your pass code will be shown after booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
