import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AdminEventCard } from "../../components/EventCard";
import {
  getAllEventsAdminAPI,
  getPendingEventsAPI,
  approveEventAPI,
  rejectEventAPI,
  adminDeleteEventAPI,
} from "../../services/api";
import toast from "react-hot-toast";

// ── Pending Event Row ────────────────────────────────────
const PendingEventRow = ({ event, onApprove, onReject, actionId }) => (
  <div className="bg-white dark:bg-[#1f3329] border border-[#8aab5a]/40 dark:border-[#8aab5a]/30 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a] rounded-lg flex items-center justify-center text-lg shrink-0">
        📋
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {event.name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {event.location}
        </p>
        {event.createdBy?.name && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            By: {event.createdBy.name}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => onApprove(event._id)}
        disabled={actionId === event._id}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      >
        {actionId === event._id ? "..." : "Approve"}
      </button>
      <button
        onClick={() => onReject(event._id)}
        disabled={actionId === event._id}
        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      >
        {actionId === event._id ? "..." : "Reject"}
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────
const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("all");
  const [actionId, setActionId] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending"

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAllEventsAdminAPI();
        setEvents(res.data);
      } catch {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    const fetchPending = async () => {
      try {
        const res = await getPendingEventsAPI();
        setPending(res.data);
      } catch {
        // pending endpoint might not exist yet — silently fail
        setPending([]);
      } finally {
        setPendingLoading(false);
      }
    };

    fetchAll();
    fetchPending();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminDeleteEventAPI(id);
      setEvents((p) => p.filter((e) => e._id !== id));
      toast.success("Event removed");
    } catch {
      toast.error("Failed to remove event");
    }
  };

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await approveEventAPI(id);
      setPending((p) => p.filter((e) => e._id !== id));
      // Update in main list too
      setEvents((p) =>
        p.map((e) => (e._id === id ? { ...e, isApproved: true } : e)),
      );
      toast.success("Event approved!");
    } catch {
      toast.error("Failed to approve event");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await rejectEventAPI(id);
      setPending((p) => p.filter((e) => e._id !== id));
      setEvents((p) =>
        p.map((e) => (e._id === id ? { ...e, isRejected: true } : e)),
      );
      toast.success("Event rejected");
    } catch {
      toast.error("Failed to reject event");
    } finally {
      setActionId(null);
    }
  };

  // Stats
  const total = events.length;
  const verified = events.filter((e) => e.createdBy?.isVerified).length;
  const pending = events.filter(
    (e) => !e.createdBy?.isVerified && !e.createdBy?.isRejected,
  ).length;

  const filtered = events
    .filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase()) ||
        e.createdBy?.name?.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((e) => statusFilter === "All" || e.status === statusFilter)
    .filter((e) => {
      if (orgFilter === "verified") return e.createdBy?.isVerified === true;
      if (orgFilter === "pending")
        return !e.createdBy?.isVerified && !e.createdBy?.isRejected;
      if (orgFilter === "rejected") return e.createdBy?.isRejected === true;
      return true;
    });

  return (
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
              All Events
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              View and moderate all platform events
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              {
                label: "Total",
                value: total,
                color: "text-[#437057] dark:text-white",
              },
              {
                label: "Verified Org",
                value: verified,
                color: "text-green-600 dark:text-green-400",
              },
              {
                label: "Pending Org",
                value: pending,
                color: "text-[#437057] dark:text-[#8aab5a]",
              },
              {
                label: "Pending Approval",
                value: pendingEvents.length,
                color: "text-orange-500 dark:text-orange-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3 text-sm"
              >
                <span className="text-gray-500 dark:text-gray-400">
                  {s.label}:{" "}
                </span>
                <span className={`font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                activeTab === "all"
                  ? "bg-[#437057] text-white border-[#437057]"
                  : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border flex items-center gap-2 ${
                activeTab === "pending"
                  ? "bg-[#8aab5a] text-white border-[#8aab5a]"
                  : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Pending Approval
              {pendingEvents.length > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "pending"
                      ? "bg-white text-[#437057]"
                      : "bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a]"
                  }`}
                >
                  {pendingEvents.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Pending Approval Tab ── */}
          {activeTab === "pending" && (
            <>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-16">
                  <svg
                    className="animate-spin h-7 w-7 text-[#437057] dark:text-white"
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
              ) : pendingEvents.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-2xl">
                  No events pending approval.
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl">
                  {pendingEvents.map((event) => (
                    <PendingEventRow
                      key={event._id}
                      event={event}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      actionId={actionId}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── All Events Tab ── */}
          {activeTab === "all" && (
            <>
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by event, location or organizer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f3329] dark:text-gray-100 px-4 py-2.5 rounded-lg w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a]"
                />
              </div>

              {/* Organizer filter */}
              <div className="mb-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide font-medium">
                  Organizer Status
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All" },
                    { value: "verified", label: "Verified" },
                    { value: "pending", label: "Pending" },
                    { value: "rejected", label: "Rejected" },
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setOrgFilter(btn.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        orgFilter === btn.value
                          ? "bg-[#437057] text-white border-[#437057]"
                          : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event status filter */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide font-medium">
                  Event Status
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Upcoming", "Completed", "Cancelled"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                        statusFilter === f
                          ? "bg-[#8aab5a] text-white border-[#8aab5a]"
                          : "bg-white dark:bg-[#1f3329] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

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
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-2xl">
                  No events found for selected filters.
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {filtered.length} event{filtered.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((event) => (
                      <AdminEventCard
                        key={event._id}
                        event={event}
                        onDelete={handleDelete}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        actionId={actionId}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
