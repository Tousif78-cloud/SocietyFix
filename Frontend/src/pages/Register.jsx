import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, UserRound, Mail, Phone, LockKeyhole, House, Eye, EyeOff } from "lucide-react";
import { registerAccount } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flat, setFlat] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 4) { setError("Password must contain at least 4 characters."); return; }
    if (!/^\+?[0-9\s()-]{10,16}$/.test(phone.trim()) || phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number (at least 10 digits).");
      return;
    }

    try {
      await registerAccount({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), flat: flat.trim(), password });
      navigate("/login", { state: { registered: true, email: email.trim().toLowerCase() } });
    } catch (err) { setError(err.message || "Could not create account. Please try again."); }
  }

  return <div className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10"><div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> Back to home</Link>
    <div className="mt-7 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white"><Building2/></div><div><h1 className="text-2xl font-bold">Create your account</h1><p className="mt-1 text-sm text-slate-500">Join your SocietyFix community</p></div></div>
    <form onSubmit={submit} className="mt-7 space-y-4">
      <div><label className="mb-1.5 block text-sm font-semibold">Full name</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><UserRound size={17} className="text-slate-400"/><input required value={name} onChange={e=>setName(e.target.value)} className="w-full py-3 outline-none" placeholder="Your full name" autoComplete="name"/></div></div>
      <div><label className="mb-1.5 block text-sm font-semibold">Email address</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><Mail size={17} className="text-slate-400"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full py-3 outline-none" placeholder="you@example.com" autoComplete="email"/></div></div>
      <div><label className="mb-1.5 block text-sm font-semibold">Phone number</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><Phone size={17} className="text-slate-400"/><input required type="tel" inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full py-3 outline-none" placeholder="e.g. 9876543210" autoComplete="tel"/></div></div>
      <div><label className="mb-1.5 block text-sm font-semibold">Flat / unit number</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><House size={17} className="text-slate-400"/><input value={flat} onChange={e=>setFlat(e.target.value)} className="w-full py-3 outline-none" placeholder="e.g. B-204"/></div></div>
      <div><label className="mb-1.5 block text-sm font-semibold">Password</label><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><LockKeyhole size={17} className="text-slate-400"/><input required minLength={4} type={showPassword ? "text" : "password"} value={password} onChange={e=>setPassword(e.target.value)} className="w-full py-3 outline-none" placeholder="At least 4 characters" autoComplete="new-password"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-slate-500 hover:text-blue-600">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <button type="submit" className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700">Create account</button>
    </form>
    <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Log in</Link></p>
  </div></div>;
}
