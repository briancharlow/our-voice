// pages/OfficialDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import OfficialDashboardHome from "../components/dashboard/OfficialDashboardHome";
import OfficialPolls from "../components/dashboard/OfficialPolls";

const OfficialDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<OfficialDashboardHome />} />
        <Route path="polls" element={<OfficialPolls />} />
      </Routes>
    </Layout>
  );
};

export default OfficialDashboard;