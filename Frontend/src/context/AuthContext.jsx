import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginAccount, logoutAccount, refreshComplaints, refreshStaff } from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => { let alive=true; getCurrentUser().then(async value=>{if(alive){setUser(value);await refreshComplaints();if(value.role==="Admin")await refreshStaff();}}).catch(()=>{if(alive)setUser(null);}).finally(()=>{if(alive)setAuthLoading(false);}); return ()=>{alive=false;}; }, []);
  useEffect(() => { if (!user) return; let active = true; const sync = async () => { if (!active) return; await refreshComplaints(); if (user.role === "Admin") await refreshStaff().catch(()=>{}); }; sync(); const timer = setInterval(sync, 5000); return () => { active = false; clearInterval(timer); }; }, [user?.id, user?.role]);
  const login = async (email, role = "Resident", profile = null, password = "") => {
    const result = await loginAccount({ email, password, role, name: profile?.name, phone: profile?.phone, flat: profile?.flat });
    setUser(result); await refreshComplaints(); if(result.role==="Admin") await refreshStaff().catch(()=>{}); return result;
  };
  const logout = async () => { try { await logoutAccount(); } finally { setUser(null); } };
  return <AuthContext.Provider value={{ user, login, logout, authLoading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
