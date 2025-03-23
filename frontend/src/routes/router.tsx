import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { WelcomePage } from "../pages/Welcome-page";
import { Register } from "../pages/Auth/Register";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../pages/Layout";
import { AuthProvider } from "../components/AuthContext";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthProvider><WelcomePage /></AuthProvider>,
    },
    {
        path: "/login",
        element: <AuthProvider><Login /></AuthProvider>,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/home",
        element: <AuthProvider><Layout /></AuthProvider>,
        children: [
            {
                path: '',
                element: <ProtectedRoute><HomePage /></ProtectedRoute>
            }

        ]
    }
])
export default router;