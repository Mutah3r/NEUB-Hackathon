import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CitizenDashboard from "../pages/dashboard/CitizenDashboard";
import CentreDashboard from "../pages/dashboard/CentreDashboard";
import AuthorityDashboard from "../pages/dashboard/AuthorityDashboard";
import RoleRedirect from "../pages/dashboard/RoleRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: RoleRedirect },
      { path: "citizen", Component: CitizenDashboard },
      { path: "centre", Component: CentreDashboard },
      { path: "authority", Component: AuthorityDashboard },
    ],
  },
]);

export default router;
