import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen font-sans">
            <Sidebar />
            <main className="flex-1 bg-gray-100 flex flex-col">
            <Header />
            <div className="flex-1 p-6 overflow-y-auto">
            <Outlet />
            </div>
            </main>
        </div>
    );
}