import toast from "react-hot-toast";

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const str = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return null;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDaysLeft = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((d - today) / (1000 * 60 * 60 * 24));
};

const BookingCard = ({ booking, onCancel }) => {
  const event = booking.event;
  if (!event) return null;
  const daysLeft = getDaysLeft(event.date);

  const handleCancel = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-800">Cancel this booking?</p>
          <p className="text-sm text-gray-500">"{event.name}"</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                onCancel(booking._id);
                toast.dismiss(t.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium"
            >
              Keep
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  return (
    <div
      className={`bg-white dark:bg-[#1f3329] border rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${
        booking.status === "cancelled"
          ? "border-red-100 dark:border-red-900 opacity-60"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {event.name}
        </h2>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${
            booking.status === "confirmed"
              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700"
          }`}
        >
          {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
        </span>
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
        <p className="flex items-center gap-2">
          <span>📍</span>
          {event.location}
        </p>
        {event.date && (
          <p className="flex items-center gap-2">
            <span>📅</span>
            {formatDate(event.date)}
          </p>
        )}
        <p className="flex items-center gap-2">
          <span>🎟️</span>
          {event.ticketPrice === 0
            ? "Free"
            : `₹${Number(event.ticketPrice).toLocaleString()}`}
        </p>
      </div>

      {booking.passCode && booking.status === "confirmed" && (
        <div className="bg-[#e8f0d8] dark:bg-gray-800 border border-[#8aab5a]/40 dark:border-[#8aab5a]/30 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
            Your Pass Code
          </p>
          <p className="text-lg font-bold text-[#437057] dark:text-[#8aab5a] tracking-widest">
            {booking.passCode}
          </p>
        </div>
      )}

      {event.date && daysLeft !== null && (
        <div
          className={`text-xs font-medium px-3 py-1.5 rounded w-fit ${
            daysLeft > 0
              ? "bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a]"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          }`}
        >
          {daysLeft > 0
            ? `${daysLeft} days remaining`
            : daysLeft === 0
              ? "Today!"
              : "Event passed"}
        </div>
      )}

      {booking.status === "confirmed" && daysLeft !== null && daysLeft > 0 && (
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="w-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg border border-red-100 dark:border-red-800 transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
