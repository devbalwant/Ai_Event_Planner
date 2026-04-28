import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getEventByIdAPI,
  verifyOrganizerAPI,
  rejectOrganizerAPI,
  adminDeleteEventAPI,
  approveEventAPI,
  rejectEventAPI,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
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
    month: "long",
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

const statusConfig = {
  Upcoming: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Completed: {
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-700",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

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

  const handleVerifyOrganizer = async () => {
    if (!event?.createdBy?._id) return;
    setActionId("verify");
    try {
      await verifyOrganizerAPI(event.createdBy._id);
      toast.success("Organizer verified!");
      setEvent((p) => ({
        ...p,
        createdBy: { ...p.createdBy, isVerified: true, isRejected: false },
      }));
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleRejectOrganizer = async () => {
    if (!event?.createdBy?._id) return;
    setActionId("reject");
    try {
      await rejectOrganizerAPI(event.createdBy._id);
      toast.success("Organizer rejected");
      setEvent((p) => ({
        ...p,
        createdBy: { ...p.createdBy, isVerified: false, isRejected: true },
      }));
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleApproveEvent = async () => {
    setActionId("approveEvent");
    try {
      await approveEventAPI(id);
      toast.success("Event approved!");
      setEvent((p) => ({ ...p, isApproved: true, isRejected: false }));
    } catch {
      toast.error("Failed to approve event");
    } finally {
      setActionId(null);
    }
  };

  const handleRejectEvent = async () => {
    setActionId("rejectEvent");
    try {
      await rejectEventAPI(id);
      toast.success("Event rejected");
      setEvent((p) => ({ ...p, isApproved: false, isRejected: true }));
    } catch {
      toast.error("Failed to reject event");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteEvent = async () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-800">Remove this event?</p>
          <p className="text-sm text-gray-500">This cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await adminDeleteEventAPI(id);
                  toast.success("Event removed");
                  navigate("/admin/events");
                } catch {
                  toast.error("Failed to remove event");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium"
            >
              Remove
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#1a1a1a]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center py-24">
            <svg
              className="animate-spin h-8 w-8 text-[#8B1538] dark:text-white"
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

  const status = statusConfig[event.status] || statusConfig.Upcoming;
  const daysLeft = getDaysLeft(event.date);
  const organizer = event.createdBy;

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#1a1a1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 mb-6 transition-colors"
          >
            ← Back
          </button>

          <div className="max-w-3xl space-y-6">
            {/* ── Event Header ── */}
            <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-7">
              <div className="flex justify-between items-start gap-4 mb-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#8B1538] dark:text-white">
                    {event.name}
                  </h1>
                  {event.category && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 mt-2 inline-block">
                      {event.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                  >
                    {event.status}
                  </span>
                  {/* Approval badge */}
                  <span
                    className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${
                      event.isApproved
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                        : event.isRejected
                          ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                          : "bg-[#E8DCC4]/30 dark:bg-[#8B1538]/20 text-[#8B1538] dark:text-[#C4A574] border-[#C4A574]/40 dark:border-[#C4A574]/30"
                    }`}
                  >
                    {event.isApproved
                      ? "✓ Approved"
                      : event.isRejected
                        ? "✗ Rejected"
                        : "⏳ Pending Approval"}
                  </span>
                </div>
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                  {event.description}
                </p>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Location", value: event.location, icon: "📍" },
                  {
                    label: "Date",
                    value: formatDate(event.date) || "Not set",
                    icon: "📅",
                  },
                  {
                    label: "Budget",
                    value: `₹${Number(event.budget).toLocaleString()}`,
                    icon: "💰",
                  },
                  {
                    label: "Ticket Price",
                    value:
                      event.ticketPrice === 0
                        ? "Free"
                        : `₹${Number(event.ticketPrice).toLocaleString()}`,
                    icon: "🎟️",
                  },
                  {
                    label: "Capacity",
                    value: event.capacity
                      ? `${event.capacity} seats`
                      : "Unlimited",
                    icon: "👥",
                  },
                  {
                    label: "Visibility",
                    value: event.isPublic ? "Public" : "Private",
                    icon: "🌐",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#E8DCC4] dark:bg-gray-800 rounded-xl p-4"
                  >
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      {item.icon} {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Days left */}
              {daysLeft !== null && (
                <div
                  className={`mt-4 text-xs font-medium px-3 py-2 rounded-lg w-fit ${
                    daysLeft > 0
                      ? "bg-[#E8DCC4]/30 dark:bg-[#8B1538]/20 text-[#8B1538] dark:text-[#C4A574]"
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
            </div>

            {/* ── Organizer Info + Admin Actions ── */}
            {organizer && (
              <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-7">
                <h2 className="text-base font-bold text-[#8B1538] dark:text-white mb-4">
                  Organizer
                </h2>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#8B1538] text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">
                      {organizer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {organizer.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {organizer.email}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${
                          organizer.isVerified
                            ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                            : organizer.isRejected
                              ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                              : "bg-[#E8DCC4]/30 dark:bg-[#8B1538]/20 text-[#8B1538] dark:text-[#C4A574] border-[#C4A574]/40 dark:border-[#C4A574]/30"
                        }`}
                      >
                        {organizer.isVerified
                          ? "Verified"
                          : organizer.isRejected
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Admin verify/reject buttons */}
                  {user?.role === "admin" && (
                    <div className="flex items-center gap-2">
                      {!organizer.isVerified && !organizer.isRejected && (
                        <>
                          <button
                            onClick={handleVerifyOrganizer}
                            disabled={!!actionId}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            {actionId === "verify"
                              ? "Verifying..."
                              : "Verify Organizer"}
                          </button>
                          <button
                            onClick={handleRejectOrganizer}
                            disabled={!!actionId}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            {actionId === "reject"
                              ? "Rejecting..."
                              : "Reject Organizer"}
                          </button>
                        </>
                      )}
                      {organizer.isVerified && (
                        <button
                          onClick={handleRejectOrganizer}
                          disabled={!!actionId}
                          className="border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Revoke Verification
                        </button>
                      )}
                      {organizer.isRejected && (
                        <button
                          onClick={handleVerifyOrganizer}
                          disabled={!!actionId}
                          className="border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Approve Instead
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Admin Event Actions ── */}
            {user?.role === "admin" && (
              <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-[#8B1538] dark:text-white">
                  Event Actions
                </h2>

                {/* Approve / Reject event */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">
                    Event Approval
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {!event.isApproved && (
                      <button
                        onClick={handleApproveEvent}
                        disabled={!!actionId}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        {actionId === "approveEvent" ? (
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
                            Approving...
                          </>
                        ) : (
                          "✓ Approve Event"
                        )}
                      </button>
                    )}
                    {!event.isRejected && (
                      <button
                        onClick={handleRejectEvent}
                        disabled={!!actionId}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        {actionId === "rejectEvent" ? (
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
                            Rejecting...
                          </>
                        ) : (
                          "✗ Reject Event"
                        )}
                      </button>
                    )}
                    {event.isApproved && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-4 py-2.5 rounded-lg border border-green-200 dark:border-green-700">
                        ✓ This event is approved
                      </span>
                    )}
                    {event.isRejected && (
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800">
                        ✗ This event is rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove event */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">
                    Danger Zone
                  </p>
                  <button
                    onClick={handleDeleteEvent}
                    className="border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Remove This Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
