const events = [
  {
    id: 1,
    name: "Birthday Party",
    location: "Indore",
    budget: 50000
  },
  {
    id: 2,
    name: "Wedding Ceremony",
    location: "Bhopal",
    budget: 200000
  },
  {
    id: 3,
    name: "Corporate Meeting",
    location: "Delhi",
    budget: 100000
  }
];

export default events;


export const eventFormFields = [
  {
    id: 1,
    label: "Event Name",
    name: "name",
    type: "text",
    placeholder: "Enter event name"
  },
  {
    id: 2,
    label: "Location",
    name: "location",
    type: "text",
    placeholder: "Enter location"
  },
  {
    id: 3,
    label: "Budget",
    name: "budget",
    type: "number",
    placeholder: "Enter budget"
  }
];