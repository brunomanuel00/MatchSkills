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
import ChatPage from "../pages/ChatPage";
import { UserProvider } from "../components/context/UserContext";

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
                element: <UserProvider> <ProfilePage /></UserProvider>
            },
            {
                path: '/admin-dashboard',
                element: <UserProvider><AdminDashboardPage /></UserProvider>
            },
            {
                path: '/chat',
                element: <ChatPage />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])
export default router;