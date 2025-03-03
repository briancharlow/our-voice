import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/Login"; 
import NotFound from "./pages/notFound";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import CitizenDashboard from "./pages/citizenDashboard";
import OfficialDashboard from "./pages/officialDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/citizen-dashboard/*" element={<CitizenDashboard />} />
        <Route path="/official-dashboard/*" element={<OfficialDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
