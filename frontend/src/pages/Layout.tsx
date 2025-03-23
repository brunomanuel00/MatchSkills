import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {

    return (
        <>
            <main>
                <Outlet />
            </main>
        </>

    );
}