// src/pages/Dashboard/BookingTable.jsx
import React from "react";
import BookingRow from "./BookingRow";
import BookingCard from "./BookingCard";

const BookingTable = ({ bookings }) => {
  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Ticket
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                From → To
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Seats
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Perks
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Total Price
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Departure
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map((booking) => (
              <BookingRow key={booking._id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
