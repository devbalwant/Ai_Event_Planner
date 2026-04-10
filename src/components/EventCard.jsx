const EventCard = ({ event, deleteEvent, editEvent }) => {
  const today = new Date();
  const eventDate = new Date(event.date);
  const daysLeft = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-xl transition">
      <h2 className="text-xl font-bold">{event.name}</h2>

      <p className="text-gray-600">Location: {event.location}</p>

      <p className="text-gray-600">Budget: ₹{event.budget}</p>

      <p className="text-gray-600">Date: {event.date}</p>

      <p className="text-gray-600 font-semibold">
        {daysLeft > 0 ? `Days Left: ${daysLeft}` : "Event Completed"}
      </p>

      <p className="mt-2">
        Status:
        <span
          className={`ml-2 px-3 py-1 text-sm rounded 
      ${event.status === "Upcoming" ? "bg-blue-100 text-blue-700" : ""}
      ${event.status === "Completed" ? "bg-green-100 text-green-700" : ""}
      ${event.status === "Cancelled" ? "bg-red-100 text-red-700" : ""}
    `}
        >
          {event.status}
        </span>
      </p>

      <button
        onClick={() => editEvent(event)}
        className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => deleteEvent(event._id)}
        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 mt-3 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default EventCard;
