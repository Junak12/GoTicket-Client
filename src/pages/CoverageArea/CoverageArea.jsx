import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

const Coverage = () => {
  const position = [23.685, 90.3563];
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();

    const location = e.target.location.value;

    const found = divisions.find((d) =>
      d.division.toLowerCase().includes(location.toLowerCase()),
    );

    if (found) {
      const coord = [found.latitude, found.longitude];

      if (mapRef.current) {
        mapRef.current.flyTo(coord, 10);
      }
    }
  };

  return (
    <div className="p-8 mt-35">
      <h2 className="text-4xl font-bold mb-6">
        We are available in all divisions of Bangladesh
      </h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <label className="flex items-center border rounded-lg px-3 py-2 w-80">
          <svg
            className="h-[1em] opacity-50 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>

          <input
            type="search"
            className="grow outline-none"
            name="location"
            placeholder="Search division..."
          />
        </label>
      </form>

      {/* Map */}
      <div className="border w-full h-[600px] rounded-xl overflow-hidden">
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
      </div>
    </div>
  );
};

export default Coverage;
