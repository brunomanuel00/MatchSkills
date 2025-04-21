import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { WelcomePage } from "../pages/Welcome-page";
import { Register } from "../pages/Auth/Register";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../pages/Layout";
import MatchesPage from "../pages/MatchesPage";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "",
        element:
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>,
        children: [
            {
                path: '/home',
                element: <HomePage />
            },
            {
                path: '/matches',
                element: <MatchesPage />
            },
            {
                path: '/profile',
                element: <ProfilePage />
            },
            {
                path: '/admin-dashboard',
                element: <AdminDashboardPage />
            },

        ]
    }
])
export default router;