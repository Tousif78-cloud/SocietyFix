import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Info } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <div className="mt-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white"><Building2 /></div>
          <div><h1 className="text-2xl font-bold">Password recovery</h1><p className="mt-1 text-sm text-slate-500">SocietyFix demo mode</p></div>
        </div>
        <div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <Info size={18} className="mb-2" />
          Signup details and passwords are not saved in this demo, so password recovery is unavailable. On the login page, enter any valid email and a password with at least 4 characters to preview a dashboard. A real password reset needs a backend.
        </div>
        <Link to="/login" className="mt-6 block w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">Go to login</Link>
      </div>
    </div>
  );
}
