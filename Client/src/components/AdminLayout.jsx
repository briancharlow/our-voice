// components/AdminLayout.jsx
import React from 'react';
import AdminSidebar from './AdminSidebar';
import Navbar from './Navbar'; // Assuming you already have this component

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;