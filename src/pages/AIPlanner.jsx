import { useState } from "react";

const AIPlanner = () => {
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-10 w-full">
      <h1 className="text-3xl font-bold mb-6">AI Event Planner</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl space-y-4">
        <input
          type="text"
          placeholder="Event Type"
          className="border p-2 w-full rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />

        <input
          type="number"
          placeholder="Number of Guests"
          className="border p-2 w-full rounded"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />

        <input
          type="number"
          placeholder="Budget"
          className="border p-2 w-full rounded"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={() => {
            setLoading(true);

            setResponse(""); 

            const generatedPrompt = `Plan a ${eventType} event for ${guests} guests with a budget of ${budget} INR in ${location}`;

            setPrompt(generatedPrompt);

            const budgetNum = Number(budget);

            setTimeout(() => {
              const fakeResponse = `
Venue: Luxury Banquet Hall in ${location}
Food: Buffet for ${guests} guests
Decoration: Theme based ${eventType} decoration
Budget Breakdown:
- Venue: ₹${budgetNum * 0.4}
- Food: ₹${budgetNum * 0.3}
- Decoration: ₹${budgetNum * 0.2}
- Misc: ₹${budgetNum * 0.1}

Timeline:
- Day 1: Planning
- Day 2: Booking
- Day 3: Execution
`;

              setResponse(fakeResponse);
              setLoading(false);
            }, 3000);
          }}
          disabled={loading}
          className="bg-purple-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          Generate Plan
        </button>

        {loading && (
          <p className="text-purple-600 font-semibold">Generating plan...</p>
        )}

        {prompt && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="font-bold mb-2">Generated Prompt:</h2>
            <p>{prompt}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <h2 className="font-bold mb-2">AI Generated Plan:</h2>

            <pre className="whitespace-pre-wrap">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;
