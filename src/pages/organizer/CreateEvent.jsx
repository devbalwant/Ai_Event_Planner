import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { createEventAPI, updateEventAPI } from "../../services/api";
import toast from "react-hot-toast";

const categories = [
  "Wedding",
  "Birthday",
  "Concert",
  "Conference",
  "Workshop",
  "Sports",
  "Festival",
  "Other",
];

const CreateEvent = ({ editingEvent, setEditingEvent }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    // When editing, extract YYYY-MM-DD from ISO date string for the date input
    const rawDate = editingEvent?.date || "";
    const dateForInput = rawDate
      ? rawDate.includes("T")
        ? rawDate.split("T")[0]
        : rawDate
      : "";
    return {
      name: editingEvent?.name || "",
      location: editingEvent?.location || "",
      budget: editingEvent?.budget || "",
      date: dateForInput,
      time: editingEvent?.time || "",
      status: editingEvent?.status || "Upcoming",
      category: editingEvent?.category || "Other",
      capacity: editingEvent?.capacity || "",
      ticketPrice: editingEvent?.ticketPrice || 0,
      description: editingEvent?.description || "",
      image: editingEvent?.image || "",
      isPublic: editingEvent?.isPublic ?? true,
    };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.budget) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      if (editingEvent) {
        await updateEventAPI(editingEvent._id, formData);
        setEditingEvent(null);
        toast.success("Event updated! Sent for admin approval again.");
      } else {
        await createEventAPI(formData);
        toast.success("Event created! Waiting for admin approval.");
      }
      navigate("/organizer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A574]/20 focus:border-[#8B1538] dark:focus:border-[#C4A574] bg-white dark:bg-[#242424] dark:text-gray-100";

  return (
    <div className="min-h-screen bg-[#E8DCC4] dark:bg-[#1a1a1a]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-[#8B1538] dark:text-white">
                {editingEvent ? "Update Event" : "Create New Event"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {editingEvent
                  ? "Edit your event details"
                  : "Fill in the details for your new event"}
              </p>
            </div>

            <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Event Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Annual Tech Conference"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of your event..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* Location + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={formData.location}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date + Time + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Event Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Event Banner Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://example.com/event-banner.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-36">
                      <img
                        src={formData.image}
                        alt="Event banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Budget + Capacity + Ticket Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Budget (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      placeholder="e.g. 50000"
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      placeholder="e.g. 200"
                      value={formData.capacity}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                      Ticket Price (₹)
                    </label>
                    <input
                      type="number"
                      name="ticketPrice"
                      placeholder="0 = Free"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Public toggle */}
                <div className="flex items-center gap-3 p-4 bg-[#E8DCC4] dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#8B1538]"
                  />
                  <div>
                    <label
                      htmlFor="isPublic"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                    >
                      Make this event public
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Public events are visible to all attendees for booking
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/organizer/dashboard")}
                    className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C4A574] hover:bg-[#B09560] text-[#0f0f0f] py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
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
                        {editingEvent ? "Updating..." : "Creating..."}
                      </>
                    ) : editingEvent ? (
                      "Update Event"
                    ) : (
                      "Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
