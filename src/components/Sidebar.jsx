import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-60 h-screen p-5">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <ul className="space-y-3">
        <li>
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/create-event"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Create Event
          </Link>
        </li>

        <li>
          <Link
            to="/ai-planner"
            className="block p-2 rounded hover:bg-gray-700"
          >
            AI Planner
          </Link>
        </li>
        <li>
          <Link to="/guests" className="block-2 p-2 rounded hover:bg-gray-700">
            Guest Management
          </Link>
        </li>
        <li>
          <Link to="/tasks"  
          className="block-2 p-2 rounded hover:bg-gray-700"
          >Task Checklist</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
