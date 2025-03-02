// pages/citizenDashboard.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardHome from "../components/dashboard/DashboardHome";
import CivicEducation from "../components/dashboard/CivicEducation";
import Polls from "../components/dashboard/Polls";
import ReportIssue from "../components/dashboard/ReportIssue";

const CitizenDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="civic-education" element={<CivicEducation />} />
        <Route path="polls" element={<Polls />} />
        <Route path="report-issue" element={<ReportIssue />} />
      </Routes>
    </Layout>
  );
};

export default CitizenDashboard;