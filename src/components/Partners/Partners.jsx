import { motion } from "framer-motion";

import biman from "../../assets/biman.jpg";
import usbangla from "../../assets/usBangla.jpg";
import hanif from "../../assets/hanif.jpg";
import greenline from "../../assets/greenline.jpg";
import shohag from "../../assets/shoagh.jpg";
import sundarban from "../../assets/sundorban.jpg";

const partners = [
  { img: biman, name: "Biman Bangladesh" },
  { img: usbangla, name: "US-Bangla Airlines" },
  { img: hanif, name: "Hanif Enterprise" },
  { img: greenline, name: "Green Line" },
  { img: shohag, name: "Shohag Paribahan" },
  { img: sundarban, name: "Sundarban Launch" },
];

const Partners = () => {
  return (
    <section
      className="py-20 overflow-hidden 
      bg-gradient-to-r from-[#0a71d9] to-[#7181b5]
      dark:from-[#0f172a] dark:via-[#111827] dark:to-[#020617]"
    >
      <h2 className="text-center text-3xl font-bold mb-14 text-white">
        Our Trusted Partners
      </h2>

      <div className="relative w-full overflow-hidden">
        {/* edge gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0a71d9] to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#7181b5] to-transparent z-10"></div>

        <motion.div
          className="flex gap-20 items-center"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 22,
            ease: "linear",
          }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 min-w-[150px]"
            >
              <img
                src={partner.img}
                alt={partner.name}
                className="h-14 object-contain bg-white p-2 rounded-md shadow-md"
              />

              <p className="text-sm font-semibold text-white text-center tracking-wide">
                {partner.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
