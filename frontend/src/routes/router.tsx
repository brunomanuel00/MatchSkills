import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { WelcomePage } from "../pages/Welcome-page";
import { Register } from "../pages/Auth/Register";
import HomePage from "../pages/HomePage";


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
        path: "/home",
        element: <HomePage />
    }
])
export default router;