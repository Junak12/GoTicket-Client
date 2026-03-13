import React from "react";
import { LuZap, LuShieldCheck } from "react-icons/lu";

const features = [
  {
    id: 1,
    title: "Fast Booking",
    desc: "Book tickets within seconds with our optimized booking system.",
    icon: LuZap,
  },
  {
    id: 2,
    title: "Secure Payment",
    desc: "All transactions are protected with modern encryption.",
    icon: LuShieldCheck,
  },
  {
    id: 3,
    title: "Multiple Transport",
    desc: "Bus, Train, Flight and Launch — all in one platform.",
    icon: LuShieldCheck,
  },
  {
    id: 4,
    title: "Instant Confirmation",
    desc: "Receive your ticket instantly after booking.",
    icon: LuShieldCheck,
  },
];

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div className="group p-7 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#ACD487] to-[#6DBE45] text-white text-2xl">
          <Icon />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {feature.title}
      </h3>

      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
        {feature.desc}
      </p>
    </div>
  );
};

const WhyChoose = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#ACD487]/20 via-white to-[#6DBE45]/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Section Heading */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Why Choose GoTicket
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Experience a smarter way to book tickets with speed, security, and
            multiple transport options across Bangladesh.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
