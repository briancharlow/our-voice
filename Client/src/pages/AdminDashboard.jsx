// pages/AdminDashboard.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminUsers from "../components/dashboard/AdminUsers";
import AdminPolls from "../components/dashboard/AdminPolls";
import AdminIssues from "../components/dashboard/AdminIssues";
import AdminDocuments from "../components/dashboard/AdminDocuments";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminUsers />} />
        <Route path="polls" element={<AdminPolls />} />
        <Route path="issues" element={<AdminIssues />} />
        <Route path="documents" element={<AdminDocuments />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;