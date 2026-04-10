import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AIPlanner = () => {
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setResponse(null);

    const generatedPrompt = `Plan a ${eventType} event for ${guests} guests with a budget of ${budget} INR in ${location}`;
    setPrompt(generatedPrompt);

    try {
      const res = await axios.post("http://localhost:5000/api/plan", {
        eventType,
        guests,
        budget,
        location,
      });

      setResponse(res.data);
    } catch (error) {
      console.log(error);
      setResponse(null);
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">AI Event Planner</h1>

          <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Event Type
              </label>
              <input
                type="text"
                placeholder="Enter event type"
                className="border p-2 w-full rounded"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Number of Guests
              </label>
              <input
                type="number"
                placeholder="Enter number of guests"
                className="border p-2 w-full rounded"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Budget</label>
              <input
                type="number"
                placeholder="Enter budget"
                className="border p-2 w-full rounded"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                className="border p-2 w-full rounded"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
             onClick={handleGeneratePlan}
              disabled={loading}
              className="bg-purple-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              Generate Plan
            </button>

            {loading && (
              <p className="text-purple-600 font-semibold">
                Generating plan...
              </p>
            )}

            {prompt && (
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">Generated Prompt:</h2>
                <p>{prompt}</p>
              </div>
            )}

            {response && (
              <div className="mt-6 p-4 bg-green-100 rounded">
                <h2 className="font-bold mb-4 text-xl">AI Generated Plan:</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Message:</p>
                    <p>{response.message}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Venue:</p>
                    <p>{response.venue}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Food:</p>
                    <p>{response.food}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Budget:</p>
                    <p>{response.budget}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Decoration:</p>
                    <p>{response.decoration}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Catering:</p>
                    <p>{response.catering}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Timeline:</p>
                    <p>{response.timeline}</p>
                  </div>

                  <div className="bg-white p-3 rounded shadow">
                    <p className="font-semibold">Guest Tip:</p>
                    <p>{response.guestTip}</p>
                  </div>
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
