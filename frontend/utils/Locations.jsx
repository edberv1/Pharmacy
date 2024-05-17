/* eslint-disable react/prop-types */
// Locations.jsx


const cities = [
  "Deçan",
  "Dragash",
  "Ferizaj",
  "Fushë Kosovë",
  "Gjakovë",
  "Gjilan",
  "Gllogovc",
  "Gracanica",
  "Hani i Elezit",
  "Istog",
  "Junik",
  "Kaçanik",
  "Kamenicë",
  "Klina",
  "Klokot",
  "Leposaviq",
  "Lipjan",
  "Malishevë",
  "Mitrovicë",
  "Novobërdë",
  "Obiliq",
  "Partesh",
  "Pejë",
  "Podujevë",
  "Prishtinë",
  "Prizren",
  "Rahovec",
  "Ranillug",
  "Shtërpcë",
  "Shtime",
  "Skënderaj",
  "Suharekë",
  "Viti",
  "Vushtrri",
  "Zubin Potok",
  "Zveçan"
];

const Locations = ({ value, onChange }) => {
  const handleLocationChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      name="location"
      className="mt-1 p-2 w-full border rounded-md"
      required
      value={value}
      onChange={handleLocationChange}
    >
      <option value="">Select a location</option>
      {cities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default Locations;
