import { Outlet } from "react-router-dom";
import { Navbar } from "../components/NavBar";
import { Footer } from "./Footer";
import { ThemeProvider } from "../components/context/theme-context";

export default function Layout() {

    return (
        <>
            <ThemeProvider>
                <Navbar />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </ThemeProvider >
        </>

    );
}