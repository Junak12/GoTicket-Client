import { motion } from "framer-motion";
import { FaBus, FaTrain, FaPlane, FaShip } from "react-icons/fa";
import Heroimg from "../../assets/HeroImage.png";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-blue-50 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight text-cyan-500"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Book Bus, Train, Launch & Flight Tickets Easily
          </motion.h1>

          <motion.p
            className="mt-5 text-gray-600 text-lg max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover routes, compare prices, and book tickets instantly with our
            smart travel booking platform designed for fast and secure travel
            experiences.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("booktickets")}
            className=" cursor-pointer mt-8 bg-[#ACD487] text-gray-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            Book Tickets
          </motion.button>

          <div className="flex items-center gap-6 mt-10 text-[#ACD487] text-3xl">
            <FaBus />
            <FaTrain />
            <FaPlane />
            <FaShip />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative flex justify-center"
        >
          <motion.img
            src={Heroimg}
            alt="Travel Booking"
            className="w-[420px] md:w-[500px] drop-shadow-2xl"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-5xl mx-auto mt-16 backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-6 grid md:grid-cols-5 gap-4"
      >
        <input
          type="text"
          placeholder="From"
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#ACD487]"
        />

        <input
          type="text"
          placeholder="To"
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#ACD487]"
        />

        <select className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#ACD487]">
          <option>Transport</option>
          <option>Bus</option>
          <option>Train</option>
          <option>Plane</option>
        </select>

        <input
          type="date"
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#ACD487]"
        />

        <button className="bg-[#ACD487] font-semibold text-gray-900 rounded-lg hover:scale-105 transition">
          Search
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
