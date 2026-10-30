import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const titles = { "/dashboard": "Dashboard", "/staff-dashboard": "Dashboard", "/admin": "Dashboard", "/admin/complaints": "All complaints", "/complaints": "Complaints", "/complaints/new": "Create complaint", "/staff": "Staff management" };
export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || (location.pathname.includes("/complaints/") ? "Complaint details" : "Dashboard");
  return <div className="min-h-screen bg-slate-50">
    <div className={`${mobileOpen ? "block" : "hidden"} fixed inset-0 z-20 bg-slate-950/50 lg:hidden`} onClick={() => setMobileOpen(false)} />
    <div className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 transition-transform lg:translate-x-0`}><Sidebar/></div>
    <div className="min-h-screen lg:pl-[250px]"><Navbar title={title} onMenu={() => setMobileOpen(!mobileOpen)}/><main className="mx-auto max-w-[1500px] p-5 md:p-8"><Outlet/></main><footer className="px-8 pb-6 text-center text-xs text-slate-400">© 2026 SocietyFix</footer></div>
  </div>;
}