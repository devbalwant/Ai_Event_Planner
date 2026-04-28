import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  getOrganizersAPI,
  verifyOrganizerAPI,
  rejectOrganizerAPI,
} from "../../services/api";
import toast from "react-hot-toast";

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrganizersAPI();
        setOrganizers(res.data);
      } catch {
        toast.error("Failed to load organizers");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleVerify = async (id) => {
    setActionId(id);
    try {
      await verifyOrganizerAPI(id);
      setOrganizers((p) =>
        p.map((o) => (o._id === id ? { ...o, isVerified: true } : o)),
      );
      toast.success("Organizer verified!");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await rejectOrganizerAPI(id);
      setOrganizers((p) =>
        p.map((o) =>
          o._id === id ? { ...o, isVerified: false, isRejected: true } : o,
        ),
      );
      toast.success("Organizer rejected");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const pending = organizers.filter((o) => !o.isVerified && !o.isRejected);
  const verified = organizers.filter((o) => o.isVerified);
  const rejected = organizers.filter((o) => o.isRejected);

  const displayed =
    filter === "pending"
      ? pending
      : filter === "verified"
        ? verified
        : rejected;

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#1a1a1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#8B1538] dark:text-white">
              Manage Organizers
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Verify or reject organizer account requests
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              {
                label: "Pending",
                value: pending.length,
                color: "text-[#8B1538] dark:text-[#C4A574]",
              },
              {
                label: "Verified",
                value: verified.length,
                color: "text-green-600 dark:text-green-400",
              },
              {
                label: "Rejected",
                value: rejected.length,
                color: "text-red-500 dark:text-red-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3 text-sm"
              >
                <span className="text-gray-500 dark:text-gray-400">
                  {s.label}:{" "}
                </span>
                <span className={`font-bold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {["pending", "verified", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border capitalize ${
                  filter === f
                    ? "bg-[#C4A574] text-[#0f0f0f] border-[#C4A574]"
                    : "bg-white dark:bg-[#242424] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                className="animate-spin h-8 w-8 text-[#8B1538] dark:text-white mb-4"
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
                Loading organizers...
              </p>
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl">
              No {filter} organizers found.
            </div>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {displayed.map((org) => (
                <div
                  key={org._id}
                  className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B1538] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {org.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {org.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {org.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Joined:{" "}
                        {new Date(org.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {org.isVerified ? (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
                        Verified
                      </span>
                    ) : org.isRejected ? (
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                        Rejected
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleVerify(org._id)}
                          disabled={actionId === org._id}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(org._id)}
                          disabled={actionId === org._id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrganizers;
