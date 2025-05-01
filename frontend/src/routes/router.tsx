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
import { MatchProvider } from "../components/context/MatchContext";
import NotFound from "../pages/NotFount";

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
                element: <MatchProvider><HomePage /></MatchProvider>
            },
            {
                path: '/matches',
                element: <MatchProvider><MatchesPage /></MatchProvider>
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
    },
    {
        path: '*',
        element: <NotFound />
    }
])
export default router;