import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getAdminStatsAPI, getPendingEventsAPI } from "../../services/api";
import toast from "react-hot-toast";

const StatCard = ({ label, value, border, sub }) => (
  <div
    className={`bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-6 border-l-4 ${border}`}
  >
    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
      {label}
    </p>
    <p className="text-4xl font-bold text-[#437057] dark:text-white mt-2">
      {value ?? "—"}
    </p>
    {sub && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pendingRes] = await Promise.allSettled([
          getAdminStatsAPI(),
          getPendingEventsAPI(),
        ]);
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
        if (pendingRes.status === "fulfilled")
          setPendingCount(pendingRes.value.data.length);
      } catch {
        toast.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
              Admin Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Platform-wide statistics and activity
            </p>
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
                Loading stats...
              </p>
            </div>
          ) : (
            <>
              {/* Main stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  label="Total Users"
                  value={stats?.totalUsers}
                  border="border-[#437057]"
                />
                <StatCard
                  label="Total Events"
                  value={stats?.totalEvents}
                  border="border-[#8aab5a]"
                />
                <StatCard
                  label="Total Bookings"
                  value={stats?.totalBookings}
                  border="border-blue-500"
                />
                <StatCard
                  label="Active Organizers"
                  value={stats?.verifiedOrganizers}
                  border="border-green-500"
                  sub="Verified"
                />
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  label="Pending Organizers"
                  value={stats?.pendingOrganizers}
                  border="border-[#8aab5a]"
                  sub="Awaiting verification"
                />
                <StatCard
                  label="Upcoming Events"
                  value={stats?.upcomingEvents}
                  border="border-blue-400"
                />
                <StatCard
                  label="Total Attendees"
                  value={stats?.totalAttendees}
                  border="border-purple-400"
                />
                <StatCard
                  label="Events Pending Approval"
                  value={pendingCount}
                  border="border-orange-400"
                  sub="Need review"
                />
              </div>

              {/* Quick links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                <a
                  href="/admin/organizers"
                  className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-[#c5d9a0]/30 dark:bg-[#437057]/20 rounded-lg flex items-center justify-center text-xl">
                    ◎
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Manage Organizers
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Verify or reject organizer accounts
                    </p>
                  </div>
                </a>
                <a
                  href="/admin/events"
                  className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                    ◈
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Manage Events
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      View and remove any event
                    </p>
                  </div>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
