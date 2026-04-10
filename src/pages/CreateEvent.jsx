import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = ({ setEvents, editingEvent, setEditingEvent }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: editingEvent?.name || "",
    location: editingEvent?.location || "",
    budget: editingEvent?.budget || "",
    date: editingEvent?.date || "",
    status: editingEvent?.status || "Upcoming",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.location || !formData.budget) {
  alert("Please fill all fields");
  return;
}

  if (editingEvent) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      )
    );

    setEditingEvent(null);
  } else {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/events",
        formData
      );

      setEvents((prev) => [...prev, res.data]);
    } catch (error) {
      console.log(error);
      alert("Error saving event");
    }
    
  } 
  setFormData({
    name: "",
    location: "",
    budget: "",
    date: "",
    status: "Upcoming",
  });

  navigate("/dashboard");
};

  return (
    <div className="p-10 w-full">
      <h1 className="text-3xl font-bold mb-6">
        {editingEvent ? "Update Event" : "Create Event"}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter event name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Budget</label>

            <input
              type="number"
              name="budget"
              placeholder="Enter budget"
              value={formData.budget}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
