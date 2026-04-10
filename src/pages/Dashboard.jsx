import {   useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import axios from "axios";
import {useEffect} from "react";

const Dashboard = ({ events,setEvents, deleteEvent, editEvent }) => {
  const [search, setSearch] = useState("");

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchEvents();
}, []);

  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">Your Event</h1>

          <input
            type="text"
            placeholder="Search Event..."
            className="border p-2 mb-6 w-64 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setStatusFilter("All")}
              className="bg-gray-200 px-4 py-1 rounded"
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("Upcoming")}
              className="bg-blue-200 px-4 py-1 rounded"
            >
              Upcoming
            </button>

            <button
              onClick={() => setStatusFilter("Completed")}
              className="bg-green-200 px-4 py-1 rounded"
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter("Cancelled")}
              className="bg-red-200 px-4 py-1 rounded"
            >
              Cancelled
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter((event) =>
                event.name.toLowerCase().includes(search.toLowerCase()),
              )
              .filter((event) =>
                statusFilter === "All" ? true : event.status === statusFilter,
              )

              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  deleteEvent={deleteEvent}
                  editEvent={editEvent}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
