import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { generatePlanAPI } from "../../services/api";
import toast from "react-hot-toast";

const planFields = [
  { key: "message", label: "Overview", icon: "📋" },
  { key: "venue", label: "Venue", icon: "🏛️" },
  { key: "food", label: "Food", icon: "🍽️" },
  { key: "budget", label: "Budget", icon: "💰" },
  { key: "decoration", label: "Decoration", icon: "🎨" },
  { key: "catering", label: "Catering", icon: "🍱" },
  { key: "timeline", label: "Timeline", icon: "⏱️" },
  { key: "guestTip", label: "Guest Tips", icon: "💡" },
];

const AIPlanner = () => {
  const [form, setForm] = useState({
    eventType: "",
    guests: "",
    budget: "",
    location: "",
  });
  const [response, setResponse] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.eventType || !form.guests || !form.budget || !form.location) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    setResponse(null);
    setPrompt(
      `Plan a ${form.eventType} for ${form.guests} guests with ₹${form.budget} budget in ${form.location}`,
    );
    try {
      const res = await generatePlanAPI(form);
      setResponse(res.data);
    } catch {
      toast.error("Failed to generate plan. Please try again.");
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
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#8B1538] dark:text-white">
              AI Event Planner
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Describe your event and get an AI-generated complete plan
            </p>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Form */}
            <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Event Type
                  </label>
                  <input
                    type="text"
                    name="eventType"
                    placeholder="e.g. Wedding, Birthday"
                    value={form.eventType}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="guests"
                    placeholder="e.g. 150"
                    value={form.guests}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    placeholder="e.g. 300000"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Delhi"
                    value={form.location}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-[#C4A574] hover:bg-[#B09560] disabled:bg-gray-300 text-[#0f0f0f] py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
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
                    Generating plan...
                  </>
                ) : (
                  "✦ Generate AI Plan"
                )}
              </button>
            </div>

            {/* Prompt preview */}
            {prompt && (
              <div className="bg-[#E8DCC4]/30 dark:bg-[#8B1538]/20 border border-[#C4A574]/40 dark:border-[#C4A574]/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#8B1538] dark:text-[#C4A574] uppercase tracking-wide mb-1">
                  Prompt Sent to AI
                </p>
                <p className="text-sm text-[#8B1538] dark:text-[#C4A574]">
                  {prompt}
                </p>
              </div>
            )}

            {/* AI Response */}
            {response && (
              <div className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-gray-700 rounded-2xl p-7 shadow-sm">
                <h2 className="text-base font-bold text-[#8B1538] dark:text-white mb-5">
                  AI Generated Plan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {planFields.map(({ key, label, icon }) =>
                    response[key] ? (
                      <div
                        key={key}
                        className="bg-[#E8DCC4] dark:bg-gray-800 rounded-xl p-4"
                      >
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                          <span>{icon}</span>
                          {label}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
                          {response[key]}
                        </p>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
