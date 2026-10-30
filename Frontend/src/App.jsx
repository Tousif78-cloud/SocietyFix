import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResidentDashboard from "./pages/resident/Dashboard";
import CreateComplaint from "./pages/resident/CreateComplaint";
import MyComplaints from "./pages/resident/MyComplaints";
import ComplaintDetails from "./pages/resident/ComplaintDetails";
import StaffDashboard from "./pages/staff/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminComplaints from "./pages/admin/Complaints";
import StaffManagement from "./pages/admin/StaffManagement";

function DashboardRedirect() {
 const { user } = useAuth();
 if (user?.role === "Admin") return <Navigate to="/admin" replace />;
 if (user?.role === "Staff") return <Navigate to="/staff-dashboard" replace />;
 return <ResidentDashboard />;
}
export default function App() {
 return <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/forgot-password" element={<ForgotPassword/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<AppLayout/>}>
   <Route path="/dashboard" element={<DashboardRedirect/>}/>
   <Route path="/complaints" element={<MyComplaints/>}/>
   <Route path="/complaints/new" element={<CreateComplaint/>}/>
   <Route path="/complaints/:id" element={<ComplaintDetails/>}/>
  </Route></Route>
  <Route element={<ProtectedRoute roles={["Staff"]}/>}><Route element={<AppLayout/>}>
   <Route path="/staff-dashboard" element={<StaffDashboard/>}/>
  </Route></Route>
  <Route element={<ProtectedRoute roles={["Admin"]}/>}><Route element={<AppLayout/>}>
   <Route path="/admin" element={<AdminDashboard/>}/>
   <Route path="/admin/complaints" element={<AdminComplaints/>}/>
   <Route path="/staff" element={<StaffManagement/>}/>
  </Route></Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>;
}
