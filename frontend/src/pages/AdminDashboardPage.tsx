import { useEffect, useRef, useState } from "react"
import { User } from "../types/authTypes"
import userService from "../services/userService"
import { Spinner } from "../components/ui/spinner";
import { toastEasy } from "../components/hooks/toastEasy";
import { useTranslation } from "react-i18next";

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const { t } = useTranslation()
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const loadUsers = async () => {
            try {
                const response = await userService.getUsers();
                setUsers(response);
            } catch (error) {
                toastEasy("error", t('errorMessages.loadingUsers'))
                console.error("Error:", error);
                setUsers([]);
            }
        };

        loadUsers();
    }, []);

    if (users === null) {
        return <Spinner />;
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <h1 className=" font-bold text-6xl">This is DashBoard</h1>
            </div>
        </>
    )
}