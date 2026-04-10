import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import AIPlanner from "./pages/AIPlanner";
import GuestManagement from "./pages/GuestManagement";
import TaskChecklist from "./pages/TaskChecklist";
import axios from "axios";

function AppContent() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const editEvent = (event) => {
    setEditingEvent(event);
    navigate("/create-event");
  };

const deleteEvent = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/events/${id}`);

    setEvents((prev) => prev.filter((event) => event._id !== id));
  } catch (error) {
    console.log(error);
  }
};

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            events={events}
            setEvents={setEvents}
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
      <Route path="/guests" element={<GuestManagement />} />
      <Route path="/tasks" element={<TaskChecklist />} />
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
