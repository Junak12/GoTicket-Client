import React from "react";

const routes = [
  {
    id: 1,
    from: "Dhaka",
    to: "Cox's Bazar",
    price: 1200,
    type: "Bus | Flight",
  },
  { id: 2, from: "Dhaka", to: "Chittagong", price: 800, type: "Bus | Train" },
  { id: 3, from: "Dhaka", to: "Sylhet", price: 650, type: "Bus | Train" },
  { id: 4, from: "Dhaka", to: "Khulna", price: 700, type: "Bus" },
  { id: 5, from: "Dhaka", to: "Rajshahi", price: 750, type: "Bus | Train" },
  { id: 6, from: "Dhaka", to: "Barisal", price: 900, type: "Launch | Bus" },
];

const RouteCard = ({ route }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {route.from} → {route.to}
        </h3>

        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Popular
        </span>
      </div>

      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
        {route.type}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-bold text-green-600">
          Starting from ৳{route.price}
        </p>

        <button className="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Book Now
        </button>
      </div>
    </div>
  );
};

const PopularRoutes = () => {
  return (
    <section className="py-15 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Popular Routes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Discover the most traveled routes across Bangladesh with the best
            prices and convenient transport options.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
