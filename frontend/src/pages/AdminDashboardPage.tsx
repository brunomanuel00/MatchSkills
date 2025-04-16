import { AdminTable } from "../components/adminDashboard/AdminTable";

export default function AdminDashboardPage() {


    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-tea_green-500 to-light_green-300 dark:from-lapis_lazuli-500 dark:to-verdigris-700">
                <AdminTable />
            </div>
        </>
    )
}