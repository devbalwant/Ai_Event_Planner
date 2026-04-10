import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addGuest = () => {
    const newGuest = {
      id: Date.now(),
      name,
      email,
      status: "Invited",
    };

    setGuests([...guests, newGuest]);

    setName("");
    setEmail("");
  };

  const deleteGuest = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const confirmGuest = (id) => {
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, status: "Confirmed" } : guest,
      ),
    );
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">Guest Management</h1>

          <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">
            <input
              type="text"
              placeholder="Guest Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <input
              type="email"
              placeholder="Guest Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <button
              onClick={addGuest}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Guest
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {guests.map((guest) => (
              <div key={guest.id} className="bg-gray-100 p-3 rounded">
                <p>{guest.name}</p>
                <p>{guest.email}</p>
                <p className="mt-2">
                  Status:
                  <span
                    className={`ml-2 px-3 py-1 rounded text-sm ${
                      guest.status === "Invited"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {guest.status}
                  </span>
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => confirmGuest(guest.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Mark Confirmed
                  </button>

                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestManagement;
