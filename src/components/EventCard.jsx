import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const statusConfig = {
  Upcoming: {
    bg: "bg-blue-50  dark:bg-blue-900/30",
    text: "text-blue-700  dark:text-blue-300",
    border: "border-blue-200  dark:border-blue-700",
  },
  Completed: {
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-700",
  },
  Cancelled: {
    bg: "bg-red-50   dark:bg-red-900/30",
    text: "text-red-600   dark:text-red-400",
    border: "border-red-200   dark:border-red-700",
  },
};

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

const EventImage = ({ image, name, height = "h-40" }) =>
  image ? (
    <img
      src={image}
      alt={name}
      className={`w-full ${height} object-cover`}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  ) : (
    <div
      className={`w-full ${height} bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-4xl`}
    >
      🎪
    </div>
  );

// ── Organizer Card ───────────────────────────────────────
export const OrganizerEventCard = ({ event, onDelete, onEdit }) => {
  const daysLeft = getDaysLeft(event.date);
  const status = statusConfig[event.status] || statusConfig.Upcoming;

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-800">Delete "{event.name}"?</p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                onDelete(event._id);
                toast.dismiss(t.id);
                toast.success("Event deleted");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  return (
    <div className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <EventImage image={event.image} name={event.name} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug">
            {event.name}
          </h2>
          <span
            className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
          >
            {event.status}
          </span>
        </div>
        <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center gap-2">
            <span>📍</span>
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <span>₹</span>
            {Number(event.budget).toLocaleString()}
          </p>
          {event.date && (
            <p className="flex items-center gap-2">
              <span>📅</span>
              {formatDate(event.date)}
              {event.time ? ` • ${event.time}` : ""}
            </p>
          )}
          {event.capacity && (
            <p className="flex items-center gap-2">
              <span>👥</span>Capacity: {event.capacity}
            </p>
          )}
        </div>
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
        <div
          className={`text-xs font-medium px-3 py-1.5 rounded w-fit border ${
            event.isApproved
              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
              : event.isRejected
                ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700"
                : "bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a] border-[#8aab5a]/40 dark:border-[#8aab5a]/30"
          }`}
        >
          {event.isApproved
            ? "✓ Approved"
            : event.isRejected
              ? "✗ Rejected"
              : "⏳ Pending Approval"}
        </div>
        <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <Link to={`/events/${event._id}`} className="flex-1">
            <button className="w-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              View
            </button>
          </Link>
          <button
            onClick={() => onEdit(event)}
            className="flex-1 text-sm font-medium text-[#437057] dark:text-[#8aab5a] hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg border border-red-100 dark:border-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Attendee Card ────────────────────────────────────────
export const AttendeeEventCard = ({ event, isBooked }) => {
  const daysLeft = getDaysLeft(event.date);

  return (
    <div className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <EventImage image={event.image} name={event.name} height="h-44" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {event.name}
          </h2>
          {event.category && (
            <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
              {event.category}
            </span>
          )}
        </div>
        <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
          {event.date && (
            <p className="flex items-center gap-2">
              <span>📅</span>
              {formatDate(event.date)}
              {event.time ? ` • ${event.time}` : ""}
            </p>
          )}
          <p className="flex items-center gap-2">
            <span>📍</span>
            {event.location}
          </p>
          <p className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <span className="font-normal text-gray-500 dark:text-gray-400">
              ₹
            </span>
            {event.ticketPrice === 0
              ? "Free"
              : Number(event.ticketPrice).toLocaleString()}
          </p>
          {event.capacity && (
            <p className="flex items-center gap-2">
              <span>👥</span>Capacity: {event.capacity}
            </p>
          )}
        </div>
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
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2 mt-auto">
          <Link to={`/events/${event._id}`}>
            <button className="w-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              View Details
            </button>
          </Link>
          {event.ticketPrice === 0 ? (
            <div className="w-full text-center text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
              🎉 Free Entry
            </div>
          ) : isBooked ? (
            <div className="w-full text-center text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 py-2 rounded-lg border border-green-200 dark:border-green-700">
              ✓ Booked
            </div>
          ) : (
            <Link to={`/attendee/book/${event._id}`}>
              <button
                disabled={daysLeft !== null && daysLeft <= 0}
                className="w-full bg-[#437057] hover:bg-[#365a46] disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {daysLeft !== null && daysLeft <= 0
                  ? "Event Ended"
                  : "Book Now"}
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Admin Card ───────────────────────────────────────────
export const AdminEventCard = ({
  event,
  onDelete,
  onApprove,
  onReject,
  actionId,
}) => {
  const status = statusConfig[event.status] || statusConfig.Upcoming;
  const approvalBadge = event.isApproved
    ? {
        label: "Approved",
        cls: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
      }
    : event.isRejected
      ? {
          label: "Rejected",
          cls: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700",
        }
      : {
          label: "Pending",
          cls: "bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a] border-[#8aab5a]/40 dark:border-[#8aab5a]/30",
        };

  return (
    <div className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <EventImage image={event.image} name={event.name} />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {event.name}
          </h2>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
            >
              {event.status}
            </span>
            <span
              className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${approvalBadge.cls}`}
            >
              {approvalBadge.label}
            </span>
          </div>
        </div>
        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
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
          {event.createdBy?.name && (
            <p className="flex items-center gap-2">
              <span>👤</span>By: {event.createdBy.name}
            </p>
          )}
        </div>
        {onApprove && onReject && !event.isApproved && !event.isRejected && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(event._id)}
              disabled={actionId === event._id}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              {actionId === event._id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => onReject(event._id)}
              disabled={actionId === event._id}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              {actionId === event._id ? "..." : "Reject"}
            </button>
          </div>
        )}
        <div className="pt-1 border-t border-gray-100 dark:border-gray-700 flex gap-2 mt-auto">
          <Link to={`/events/${event._id}`} className="flex-1">
            <button className="w-full text-sm font-medium text-[#437057] dark:text-[#8aab5a] hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              View Details
            </button>
          </Link>
          <button
            onClick={() => onDelete(event._id)}
            className="flex-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded-lg border border-red-100 dark:border-red-800 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
