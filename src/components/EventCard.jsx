const EventCard = ({ event, deleteEvent }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-xl transition">

      <h2 className="text-xl font-bold">
        {event.name}
      </h2>

      <p className="text-gray-600">
        Location: {event.location}
      </p>

      <p className="text-gray-600">
        Budget: ₹{event.budget}
      </p>

        <button
        onClick={() => editEvent(event)}
        className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
        >
          Edit
        </button>


      <button onClick={() => deleteEvent(event.id)}
        className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 mt-3 rounded">
          Delete
      </button>

    </div>
  );
};

export default EventCard;