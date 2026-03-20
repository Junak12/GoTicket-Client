import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";
import AllTickets from "../pages/AllTickets/AllTickets";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import CoverageArea from "../pages/CoverageArea/CoverageArea";
import BookTicket from "../pages/BookTicket/BookTicket";
import TicketDetails from "../components/TicketDetails/TicketDetails";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Payment/PaymentCancel";
import DashboardLayout from "../layouts/DashboardLayout";
import RoleRoute from "./RoleRoute";
import Profile from "../pages/DashBoard/User/Profile";
import MyBookings from "../pages/DashBoard/User/MyBookings";
import Transactions from "../pages/DashBoard/User/Transactions";
import JoinPartner from "../pages/JoinPartner/JoinPartner";
import AdminProfile from "../pages/DashBoard/Admin/AdminProfile";
import ManageTickets from "../pages/DashBoard/Admin/ManageTickets";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "alltickets",
        element: (
          <PrivateRoute>
            <AllTickets />
          </PrivateRoute>
        ),
      },
      { path: "coveragearea", element: <CoverageArea /> },
      {
        path: "booktickets",
        element: (
          <PrivateRoute>
            <BookTicket />
          </PrivateRoute>
        ),
      },
      {
        path: "tickets/:id",
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "vendor",
        element: (
          <PrivateRoute>
            <JoinPartner />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "payment-cancelled",
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
    ],
  },
  // Dashboard routes
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "user/profile",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <Profile />
          </RoleRoute>
        ),
      },
      {
        path: "user/my-bookings",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <MyBookings />
          </RoleRoute>
        ),
      },
      {
        path: "user/my-transactions",
        element: (
          <RoleRoute allowedRoles={["user"]}>
            <Transactions />
          </RoleRoute>
        ),
      },
      {
        path: "/dashboard/admin/profile",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <AdminProfile />
          </RoleRoute>
        ),
      },
      {
        path: "/dashboard/admin/manage-tickets",
        element: (
          <RoleRoute allowedRoles={["admin"]}>
            <ManageTickets />
          </RoleRoute>
        ),
      },
    ],
  },
]);
