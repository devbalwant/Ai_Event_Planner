import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const roleBadge = {
  admin: { label: "Admin", bg: "bg-red-500" },
  organizer: { label: "Organizer", bg: "bg-[#437057]" },
  attendee: { label: "Attendee", bg: "bg-blue-500" },
};

// Sun icon
const SunIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="5" />
    <path
      strokeLinecap="round"
      d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
    />
  </svg>
);

// Moon icon
const MoonIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const badge = user ? roleBadge[user.role] : null;

  return (
    <div className="bg-[#437057] dark:bg-[#1a2e22] text-white px-8 py-4 flex justify-between items-center shadow-md sticky top-0 z-50 border-b border-white/5">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#8aab5a] rounded-lg flex items-center justify-center text-sm font-bold">
          EP
        </div>
        <span className="text-lg font-semibold tracking-wide">EventPro</span>
      </Link>

      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user ? (
          <>
            {badge && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${badge.bg}`}
              >
                {badge.label}
              </span>
            )}
            <span className="text-sm text-gray-300 hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link to="/login">
              <button className="text-sm text-gray-300 hover:text-white px-4 py-2 transition-colors hover:bg-white/10 rounded-lg">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-[#8aab5a] hover:bg-[#7a9a4e] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
