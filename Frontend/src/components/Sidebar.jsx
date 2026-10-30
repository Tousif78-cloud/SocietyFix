import { NavLink } from "react-router-dom";
import { Building2, LayoutDashboard, PlusCircle, ClipboardList, Users, Settings, LogOut, } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = ["Admin", "Staff"].includes(user?.role);
  return <aside className="sidebar-scroll fixed inset-y-0 left-0 z-30 flex w-[250px] flex-col overflow-y-auto bg-slate-950 px-4 py-5 text-white">
    <div className="mb-9 flex items-center gap-3 px-2">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500"><Building2 size={22}/></div>
      <div><div className="text-lg font-bold tracking-tight">SocietyFix</div><div className="text-xs text-slate-400">Community portal</div></div>
    </div>
    <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</div>
    <nav className="space-y-1">
      <NavLink to={user?.role === "Admin" ? "/admin" : user?.role === "Staff" ? "/staff-dashboard" : "/dashboard"} end className={linkClass}><LayoutDashboard size={18}/> Dashboard</NavLink>
      {user?.role === "Resident" && <NavLink to="/complaints/new" end className={linkClass}><PlusCircle size={18}/> Create complaint</NavLink>}
      <NavLink to={user?.role === "Admin" ? "/admin/complaints" : "/complaints"} end className={linkClass}><ClipboardList size={18}/> {isAdmin ? "All complaints" : "My complaints"}</NavLink>
      {user?.role === "Admin" && <NavLink to="/staff" end className={linkClass}><Users size={18}/> Staff management</NavLink>}
    </nav>
    <div className="mt-auto border-t border-slate-800 pt-4">
      <div className="flex items-center gap-3 rounded-xl px-2 py-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{user?.name?.slice(0,1) || "U"}</div>
        <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{user?.name}</div><div className="text-xs text-slate-400">{user?.role}</div></div>
        <button onClick={logout} title="Sign out" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><LogOut size={17}/></button>
      </div>
    </div>
  </aside>;
}