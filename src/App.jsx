
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";

function App() {

  const [events, setEvents] = useState(null); 

  const editEvent = (event) => {
    setEditingEvent(event)
    Navigate("/crate-event")
  }

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !==id))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard events={events} deleteEvent={deleteEvent} editEvent={={editEvent}} />} />

        <Route path="/create-event" element={<CreateEvent  setEvents={setEvents} editing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
