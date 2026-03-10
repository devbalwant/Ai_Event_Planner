import { useState } from "react";
import { eventFormFields } from "../data";
import { useNavigate } from "react-router-dom";

const CreateEvent = ({ setEvents }) => {


    //Navigate hook
    const navigate = useNavigate()


  // Step 1: state for form values
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  // Step 2: handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") setName(value);
    if (name === "location") setLocation(value);
    if (name === "budget") setBudget(value);
  };

  // Step 3: form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now(),
      name,
      location,
      budget
    };

    // Step 4: add event to events list
    setEvents(prevEvents => [...prevEvents, newEvent]);

    // Step 5: reset form
    setName("");
    setLocation("");
    setBudget("");

    // dashboard redirect
        navigate("/dashboard")
  };

  return (
    <div className="p-10 w-full">

      <h1 className="text-3xl font-bold mb-6">
        Create Event
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl">

        <form onSubmit={handleSubmit} className="space-y-4">

          {eventFormFields.map((field) => (
            <div key={field.id}>

              <label className="block text-sm font-semibold mb-1">
                {field.label}
              </label>

              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                vaue={
                    field.name === "name"
                    ? name
                    : field.name === "location"
                    ? location
                    : budget
                }
                onChange={handleChange}
                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>
          ))}

          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Create Event
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateEvent;