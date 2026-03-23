import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LuMapPin, LuUsers, LuTicket } from "react-icons/lu";

const TicketList = ({ tickets }) => {
  const navigate = useNavigate();

  // 🔥 Perk Icon Logic
  const getPerkIcon = (name) => {
    const key = name.toLowerCase();
    if (key.includes("wifi")) return "📶";
    if (key.includes("ac")) return "❄️";
    if (key.includes("snack") || key.includes("food")) return "🍔";
    return "✨";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {tickets.map((ticket) => (
        <motion.div
          key={ticket._id}
          whileHover={{ y: -8, boxShadow: "0px 15px 25px rgba(0,0,0,0.2)" }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col h-full"
        >
          {/* Image */}
          <div className="relative">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover"
            />
            <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow">
              {ticket.transportType}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
              {ticket.title}
            </h2>

            {/* Route */}
            <div className="flex items-center gap-2 text-gray-500 mt-2 text-xs sm:text-sm">
              <LuMapPin size={16} />
              <span>
                {ticket.from} → {ticket.to}
              </span>
            </div>


            <div className="flex flex-wrap gap-2 mt-3">
              {ticket.perks?.slice(0, 3).map((perk, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <span>{getPerkIcon(perk.name)}</span>
                  {perk.name}
                </span>
              ))}

              {ticket.perks?.length > 3 && (
                <span className="text-[10px] sm:text-xs text-gray-500">
                  +{ticket.perks.length - 3} more
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
              <div className="flex items-center gap-1">
                <LuUsers size={16} />
                <span>{ticket.quantity} seats</span>
              </div>
              <div className="flex items-center gap-1">
                <LuTicket size={16} />
                <span>{ticket.bookingCount} booked</span>
              </div>
            </div>

            {/* Price + Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-3 sm:gap-0">
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                ৳ {ticket.price}
              </span>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="w-full cursor-pointer sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg  font-semibold text-white bg-[#ACD487] shadow hover:opacity-90 transition"
              >
                See Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TicketList;
