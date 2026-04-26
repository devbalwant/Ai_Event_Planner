import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetail from "./pages/EventDetail";

// Organizer pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import AIPlanner from "./pages/organizer/AIPlanner";
import GuestManagement from "./pages/organizer/GuestManagement";
import TaskChecklist from "./pages/organizer/TaskChecklist";

// Attendee pages
import AttendeeDashboard from "./pages/attendee/AttendeeDashboard";
import BrowseEvents from "./pages/attendee/BrowseEvents";
import BookingPage from "./pages/attendee/BookingPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageOrganizers from "./pages/admin/ManageOrganizers";
import ManageEvents from "./pages/admin/ManageEvents";

// ── "/" redirect based on role ───────────────────────────
const RootRedirect = () => {
  const { user } = useAuth();
  // No user or invalid user → Home
  if (!user || (!user._id && !user.id) || !user.role) return <Home />;
  // Logged in → own dashboard
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "organizer")
    return <Navigate to="/organizer/dashboard" replace />;
  if (user.role === "attendee")
    return <Navigate to="/attendee/dashboard" replace />;
  // Unknown role → Home
  return <Home />;
};

// ── Already logged in → redirect away from login/register ─
const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || (!user._id && !user.id) || !user.role) return children;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "organizer")
    return <Navigate to="/organizer/dashboard" replace />;
  if (user.role === "attendee")
    return <Navigate to="/attendee/dashboard" replace />;
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState(null);

  const editEvent = (event) => {
    setEditingEvent(event);
    navigate("/organizer/create");
  };

  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<RootRedirect />} />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* ── Organizer ── */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute role="organizer">
            <OrganizerDashboard editEvent={editEvent} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/create"
        element={
          <ProtectedRoute role="organizer">
            <CreateEvent
              editingEvent={editingEvent}
              setEditingEvent={setEditingEvent}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/ai-planner"
        element={
          <ProtectedRoute role="organizer">
            <AIPlanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/guests"
        element={
          <ProtectedRoute role="organizer">
            <GuestManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/tasks"
        element={
          <ProtectedRoute role="organizer">
            <TaskChecklist />
          </ProtectedRoute>
        }
      />

      {/* ── Attendee ── */}
      <Route
        path="/attendee/dashboard"
        element={
          <ProtectedRoute role="attendee">
            <AttendeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendee/events"
        element={
          <ProtectedRoute role="attendee">
            <BrowseEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendee/book/:id"
        element={
          <ProtectedRoute role="attendee">
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* ── Admin ── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/organizers"
        element={
          <ProtectedRoute role="admin">
            <ManageOrganizers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute role="admin">
            <ManageEvents />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback — unknown route → home ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
