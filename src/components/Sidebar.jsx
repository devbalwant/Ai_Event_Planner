import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuByRole = {
  organizer: [
    { to: "/organizer/dashboard", label: "Dashboard", icon: "▦" },
    { to: "/organizer/create", label: "Create Event", icon: "＋" },
    { to: "/organizer/ai-planner", label: "AI Planner", icon: "✦" },
    { to: "/organizer/guests", label: "Guest Mgmt", icon: "◎" },
    { to: "/organizer/tasks", label: "Task Checklist", icon: "☑" },
  ],
  attendee: [
    { to: "/attendee/dashboard", label: "My Bookings", icon: "▦" },
    { to: "/attendee/events", label: "Browse Events", icon: "◈" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: "▦" },
    { to: "/admin/organizers", label: "Organizers", icon: "◎" },
    { to: "/admin/events", label: "All Events", icon: "◈" },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const items = user ? menuByRole[user.role] || [] : [];

  return (
    <div className="bg-[#8B1538] dark:bg-[#1a1a1a] text-[#D4C8B0] dark:text-[#a3a3a3] w-56 min-h-screen p-5 flex flex-col gap-1 shrink-0 border-r border-[#C4A574]/20 dark:border-[#333333]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C4A574]/70 dark:text-[#C4A574] mb-3 px-2">
        Menu
      </p>
      {items.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-[#C4A574] text-[#0f0f0f] shadow-md"
                : "hover:bg-[#C4A574]/20 dark:hover:bg-[#242424] text-[#E8DCC4] dark:text-[#e5e5e5]"
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
