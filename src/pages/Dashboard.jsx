import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";

const Dashboard = ({ events, deleteEvent, editEvent }) => {
  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">Your Event</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event}  deleteEvent={deleteEvent} editEvent={editEvent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
