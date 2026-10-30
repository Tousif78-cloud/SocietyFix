import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Mail, LockKeyhole, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Resident");
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@") || password.trim().length < 4) {
      setError("Enter a valid email and a password with at least 4 characters.");
      return;
    }

    try {
      const signedIn = await login(cleanEmail, role, null, password);
      if (signedIn.role === "Admin") navigate("/admin", { replace: true });
      else if (signedIn.role === "Staff") navigate("/staff-dashboard", { replace: true });
      else navigate("/dashboard", { replace: true });
    } catch (err) { setError(err.message || "Could not sign in. Please try again."); }
  }
  return <div className="grid min-h-screen bg-white lg:grid-cols-2">
    <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"/><div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"/>
      <Link to="/login" className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500"><Building2 size={24}/></div><span className="text-xl font-bold">SocietyFix</span></Link>
      <div className="relative max-w-lg"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-blue-200"><ShieldCheck size={15}/> Your community, connected</div><h1 className="text-5xl font-bold leading-tight tracking-tight">A better way to manage your <span className="text-blue-400">society.</span></h1><p className="mt-5 max-w-md leading-7 text-slate-400">Raise concerns, stay updated, and keep your community running smoothly from one simple place.</p>
        <div className="mt-10 grid grid-cols-3 gap-4">{[["24/7","Portal access"],["1 place","All complaints"],["Simple","Updates"]].map(x=><div key={x[0]} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-xl font-bold">{x[0]}</div><div className="mt-1 text-xs text-slate-400">{x[1]}</div></div>)}</div>
      </div><p className="relative text-xs text-slate-500">Designed for modern residential communities.</p>
    </div>
    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md"><div className="mb-8 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><Building2/></div><span className="text-xl font-bold">SocietyFix</span></div>
        {location.state?.registered && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">Signup request completed. Sign in with your registered email and password.</p>}
        {user && <p className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">Current demo session: <strong>{user.email}</strong>. Choose a role below to switch dashboards.</p>}
        <p className="text-sm font-semibold text-blue-600">WELCOME BACK</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2><p className="mt-2 text-sm leading-6 text-slate-500">Development demo: choose Resident, Staff, or Admin before signing in. Demo accounts can switch roles for testing; accounts and sessions reset when the backend restarts.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"><Mail size={18} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full py-3.5 text-sm outline-none" placeholder="you@example.com" required/></div></div>
          <div><div className="mb-2 flex justify-between"><label className="text-sm font-semibold text-slate-700">Password</label><Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link></div><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"><LockKeyhole size={18} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full py-3.5 text-sm outline-none" placeholder="Enter your password" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-slate-500 hover:text-blue-600">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Sign in as</label><select value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 text-sm outline-none focus:border-blue-500"><option>Resident</option><option>Staff</option><option>Admin</option></select></div>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Sign in <ArrowRight size={17}/></button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">New to SocietyFix? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">Create account</Link></p>
      </div>
    </div>
  </div>;
}