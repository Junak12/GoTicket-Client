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


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "alltickets",
        element: (
          <PrivateRoute>
            <AllTickets></AllTickets>
          </PrivateRoute>
        ),
      },
      {
        path: "coveragearea",
        Component: CoverageArea,
      },
      {
        path: "booktickets",
        element: (
          <PrivateRoute>
            <BookTicket />
          </PrivateRoute>
        ),
      },
      {
        path: "/tickets/:id",
        element: (
          <PrivateRoute>
            <TicketDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
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
        element:<PrivateRoute>
          <PaymentCancel/>
        </PrivateRoute>
      },
    ],
  },
]);