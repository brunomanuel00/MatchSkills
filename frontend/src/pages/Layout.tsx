import { Outlet } from "react-router-dom";
import { Navbar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Toaster } from "../components/ui/toaster";

export default function Layout() {

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
                <Toaster />
            </main>
            <Footer />

        </>

    );
}