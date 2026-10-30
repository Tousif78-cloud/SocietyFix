import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Clock3, CheckCircle2, Plus, ArrowRight, Wrench, CalendarDays } from "lucide-react";
import { getComplaints } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
 const { user } = useAuth();
 const [complaints, setComplaints] = useState(getComplaints);
 useEffect(() => {
   const refresh = () => setComplaints(getComplaints());
   window.addEventListener("societycare:complaints-updated", refresh);
   window.addEventListener("storage", refresh);
   return () => { window.removeEventListener("societycare:complaints-updated", refresh); window.removeEventListener("storage", refresh); };
 }, []);
 const mine = useMemo(() => complaints.filter(c => c.residentEmail === (user?.email || "").toLowerCase()), [complaints, user?.email]);
 const stats = [
  { label: "Total complaints", value: mine.length, note: "Complaints you have submitted", icon: ClipboardList, tint: "bg-blue-50 text-blue-600" },
  { label: "In progress", value: mine.filter(c => ["In progress", "Assigned"].includes(c.status)).length, note: "Currently being handled", icon: Clock3, tint: "bg-amber-50 text-amber-600" },
  { label: "Resolved", value: mine.filter(c => c.status === "Resolved" || c.status === "Closed").length, note: "Issues marked complete", icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" }
 ];
 const recent = [...mine].sort((a,b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0,4);
 return <div className="space-y-7">
   <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-lg shadow-blue-600/15 md:p-8">
    <div className="absolute -right-8 -top-16 h-56 w-56 rounded-full border-[35px] border-white/10"/><div className="absolute right-28 top-28 h-24 w-24 rounded-full bg-cyan-300/10"/>
    <div className="relative max-w-2xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium"><CalendarDays size={14}/>{new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</div><h2 className="text-2xl font-bold md:text-3xl">Good day, {user?.name?.split(" ")[0] || "there"} 👋</h2><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">Welcome to your society dashboard. Track the complaints you submit and follow their progress here.</p><Link to="/complaints/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"><Plus size={17}/> Create a complaint</Link></div>
   </section>
   <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{stats.map(s=><div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft"><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tint}`}><s.icon size={21}/></div></div><div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{s.value}</div><div className="mt-1 text-sm font-medium text-slate-600">{s.label}</div><div className="mt-2 text-xs text-slate-400">{s.note}</div></div>)}</section>
   <section>
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-soft"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><h3 className="font-bold text-slate-900">Recent complaints</h3><p className="mt-1 text-xs text-slate-400">Your latest submitted requests</p></div><Link to="/complaints" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">View all <ArrowRight size={15}/></Link></div>
      {recent.length ? <div className="divide-y divide-slate-100">{recent.map(c=><Link to={`/complaints/${c.id}`} key={c.id} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><Wrench size={18}/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-slate-800">{c.title}</div><div className="mt-1 text-xs text-slate-400">{c.id} · {c.date}</div></div><div className="hidden sm:block"><StatusBadge status={c.status}/></div></Link>)}</div> : <div className="p-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><ClipboardList size={22}/></div><p className="mt-3 font-semibold text-slate-800">No complaints yet</p><p className="mt-1 text-sm text-slate-500">Your new complaint will appear here automatically.</p><Link to="/complaints/new" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16}/> Create your first complaint</Link></div>}
    </div>

   </section>
 </div>;
}
