import React from "react";
import { useNavigate } from "react-router";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border dark:border-slate-700 text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Payment Failed ❌
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your payment could not be processed. Please try again or contact
          support if the problem persists.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
