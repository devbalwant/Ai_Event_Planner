import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [search, setSearch] = useState("");

  const addGuest = () => {
    if (!form.name.trim()) {
      toast.error("Guest name is required");
      return;
    }
    setGuests([...guests, { id: Date.now(), ...form, status: "Invited" }]);
    setForm({ name: "", email: "", phone: "" });
    toast.success("Guest added");
  };

  const deleteGuest = (id) => setGuests(guests.filter((g) => g.id !== id));
  const confirmGuest = (id) =>
    setGuests(
      guests.map((g) => (g.id === id ? { ...g, status: "Confirmed" } : g)),
    );

  const confirmed = guests.filter((g) => g.status === "Confirmed").length;
  const invited = guests.filter((g) => g.status === "Invited").length;

  const filtered = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()),
  );

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a] bg-white dark:bg-[#1f3329] dark:text-gray-100";

  return (
    <div className="min-h-screen bg-[#f0f5e8] dark:bg-[#1a2e22]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#437057] dark:text-white">
              Guest Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Add and manage your event guests
            </p>
          </div>

          {/* Stats */}
          {guests.length > 0 && (
            <div className="flex gap-4 mb-6 flex-wrap">
              {[
                {
                  label: "Total",
                  value: guests.length,
                  color: "text-[#437057] dark:text-white",
                },
                {
                  label: "Confirmed",
                  value: confirmed,
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  label: "Invited",
                  value: invited,
                  color: "text-[#437057] dark:text-[#8aab5a]",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3 text-sm"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {s.label}:{" "}
                  </span>
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Guest Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Add New Guest
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full name *"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={inputClass}
                  />
                  <button
                    onClick={addGuest}
                    className="w-full bg-[#437057] hover:bg-[#365a46] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Add Guest
                  </button>
                </div>
              </div>
            </div>

            {/* Guest List */}
            <div className="lg:col-span-2">
              {guests.length > 0 && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search guests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f3329] dark:text-gray-100 px-4 py-2.5 rounded-lg w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#8aab5a]/20 focus:border-[#437057] dark:focus:border-[#8aab5a]"
                  />
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-2xl">
                  {guests.length === 0
                    ? "No guests added yet."
                    : "No guests match your search."}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((guest) => (
                    <div
                      key={guest.id}
                      className="bg-white dark:bg-[#1f3329] border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#437057] text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {guest.name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {guest.email || guest.phone || "No contact info"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            guest.status === "Confirmed"
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                              : "bg-[#c5d9a0]/30 dark:bg-[#437057]/20 text-[#437057] dark:text-[#8aab5a] border-[#8aab5a]/40 dark:border-[#8aab5a]/30"
                          }`}
                        >
                          {guest.status}
                        </span>
                        {guest.status === "Invited" && (
                          <button
                            onClick={() => confirmGuest(guest.id)}
                            className="text-xs text-[#437057] dark:text-white hover:underline font-medium"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="text-xs text-red-500 dark:text-red-400 hover:underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestManagement;
