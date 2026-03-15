import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const divisions = [
  { division: "Dhaka", latitude: 23.8103, longitude: 90.4125 },
  { division: "Chattogram", latitude: 22.3569, longitude: 91.7832 },
  { division: "Khulna", latitude: 22.8456, longitude: 89.5403 },
  { division: "Rajshahi", latitude: 24.3745, longitude: 88.6042 },
  { division: "Sylhet", latitude: 24.8949, longitude: 91.8687 },
  { division: "Barishal", latitude: 22.701, longitude: 90.3535 },
  { division: "Rangpur", latitude: 25.7439, longitude: 89.2752 },
  { division: "Mymensingh", latitude: 24.7471, longitude: 90.4203 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const Coverage = () => {
  const position = [23.685, 90.3563];
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const location = e.target.location.value;

    const found = divisions.find((d) =>
      d.division.toLowerCase().includes(location.toLowerCase()),
    );

    if (found && mapRef.current) {
      const coord = [found.latitude, found.longitude];
      mapRef.current.flyTo(coord, 10, { duration: 2 });
    }
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cyan-500">
          Coverage Area
        </h2>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          GoTicket service is available across all divisions of Bangladesh.
          Search a division to quickly locate it on the map.
        </p>
      </motion.div>

      {/* Search */}
      <motion.form
        variants={item}
        onSubmit={handleSearch}
        className="flex justify-center mb-8"
      >
        <div className="flex items-center w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl px-4 py-2 shadow-sm">
          <svg
            className="h-5 w-5 text-gray-400 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>

          <input
            type="search"
            name="location"
            placeholder="Search division (e.g. Dhaka)"
            className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
          />

          <button
            type="submit"
            className="ml-3 px-4 py-1 bg-[#ACD487] rounded-lg text-sm font-medium hover:opacity-90"
          >
            Search
          </button>
        </div>
      </motion.form>

      {/* Map */}
      <motion.div
        variants={item}
        className="w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-2xl overflow-hidden border shadow-md"
      >
        <MapContainer
          center={position}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {divisions.map((div, index) => (
            <Marker key={index} position={[div.latitude, div.longitude]}>
              <Popup>
                <strong>{div.division}</strong> Division
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      {/* Buttons */}
      <motion.div
        variants={container}
        className="flex flex-wrap justify-center gap-3 mt-8"
      >
        {divisions.map((div, index) => (
          <motion.button
            variants={item}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            key={index}
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo([div.latitude, div.longitude], 9);
              }
            }}
            className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-[#ACD487] hover:text-black transition"
          >
            {div.division}
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Coverage;
