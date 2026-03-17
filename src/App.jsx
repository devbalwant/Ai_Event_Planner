import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import AIPlanner from "./pages/AIPlanner";

function AppContent() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const editEvent = (event) => {
    setEditingEvent(event);
    navigate("/create-event");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            events={events}
            deleteEvent={deleteEvent}
            editEvent={editEvent}
          />
        }
      />

      <Route
        path="/create-event"
        element={
          <CreateEvent
            setEvents={setEvents}
            editingEvent={editingEvent}
            setEditingEvent={setEditingEvent}
          />
        }
      />
      <Route path="/ai-planner" element={<AIPlanner />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
