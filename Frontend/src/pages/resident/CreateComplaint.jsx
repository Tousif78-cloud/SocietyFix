import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Paperclip, Send, X, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getComplaints, saveComplaints, refreshComplaints } from "../../services/api";

export default function CreateComplaint() {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [form, setForm] = useState({title:"", category:"Plumbing", priority:"Medium", description:""});
 const [error, setError] = useState("");
 const [photo, setPhoto] = useState("");
 const [photoName, setPhotoName] = useState("");
 const [photoError, setPhotoError] = useState("");
 const update = e => setForm({...form, [e.target.name]: e.target.value});
 async function submit(e) {
   e.preventDefault(); setError("");
   if (form.title.trim().length < 3) { setError("Please enter a complaint title with at least 3 characters."); return; }
   if (form.description.trim().length < 10) { setError("Please add at least 10 characters describing the issue."); return; }
   const items = getComplaints();
   const complaint = {
     ...form,
     title: form.title.trim(), description: form.description.trim(),
     id: `CMP-${Date.now().toString().slice(-7)}`,
     status: "Open",
     date: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
     createdAt: new Date().toISOString(),
     resident: user?.name || "Resident", residentEmail: (user?.email || "").toLowerCase(),
     flat: user?.flat || "Not set",
     complaintPhoto: photo || ""
   };
   try { await saveComplaints([complaint, ...items]); await refreshComplaints(); } catch (err) { setError(err.message || "Could not submit complaint to the server."); return; }
   navigate("/complaints", { state: { complaintCreated: true } });
 }
 return <div className="mx-auto max-w-3xl"><Link to="/complaints" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft size={16}/> Back to complaints</Link><div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="mb-7"><div className="text-sm font-semibold text-blue-600">RESIDENT SERVICES</div><h2 className="mt-2 text-2xl font-bold">Create a complaint</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tell us what needs attention. The society team will review your request.</p></div>
 <form onSubmit={submit} className="space-y-5">
  <div><label className="mb-2 block text-sm font-semibold">Complaint title <span className="text-rose-500">*</span></label><input name="title" value={form.title} onChange={update} required maxLength={100} placeholder="e.g. Water leakage in kitchen" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"/></div>
  <div className="grid gap-5 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold">Category</label><select name="category" value={form.category} onChange={update} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500">{["Plumbing","Electrical","Cleaning","Security","Lift","Common area","Other"].map(x=><option key={x}>{x}</option>)}</select></div><div><label className="mb-2 block text-sm font-semibold">Priority</label><select name="priority" value={form.priority} onChange={update} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500">{["Low","Medium","High"].map(x=><option key={x}>{x}</option>)}</select></div></div>
  <div><label className="mb-2 block text-sm font-semibold">Describe the issue <span className="text-rose-500">*</span></label><textarea name="description" value={form.description} onChange={update} required rows={5} placeholder="Include the location, when it started, and any useful details..." className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"/><div className="mt-1 text-right text-xs text-slate-400">{form.description.length} characters</div></div>
  <div className="rounded-xl border border-dashed border-slate-300 p-4"><label htmlFor="resident-complaint-photo" className="flex cursor-pointer items-center gap-3 text-sm text-slate-600 hover:text-blue-700"><span className="rounded-lg bg-blue-50 p-2 text-blue-600"><Camera size={18}/></span><span><strong className="block text-slate-800">Attach a photo (optional)</strong><span className="mt-1 block text-xs text-slate-500">Choose an image or take a photo on your device</span></span></label><input id="resident-complaint-photo" type="file" accept="image/*" capture="environment" className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700" onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){setPhotoError("Please select an image file.");return;}if(file.size>8*1024*1024){setPhotoError("Please select an image smaller than 8 MB.");return;}const reader=new FileReader();reader.onload=()=>{setPhoto(String(reader.result||""));setPhotoName(file.name);setPhotoError("")};reader.onerror=()=>setPhotoError("This image could not be opened. Please try another one.");reader.readAsDataURL(file);e.target.value="";}}/>{photoError&&<p className="mt-2 text-xs text-rose-600">{photoError}</p>}{photo&&<div className="mt-3 flex items-start gap-3"><img src={photo} alt="Complaint attachment preview" className="h-24 w-28 rounded-lg border object-cover"/><div className="min-w-0 flex-1"><p className="break-all text-xs text-slate-600">{photoName}</p><button type="button" onClick={()=>{setPhoto("");setPhotoName("")}} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600"><X size={14}/> Remove photo</button></div></div>}</div>
  {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={()=>navigate("/complaints")} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Send size={16}/> Submit complaint</button></div>
 </form></div></div>;
}
