// components/dashboard/AdminUsers.jsx
import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/getUsers', {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.Users);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch('http://localhost:4000/users/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.Id === userId ? { ...user, Role: newRole } : user
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {error && (
        <div className="p-2 text-center text-white bg-red-500 rounded mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.Id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.Email}</td>
                    <td className="py-3 px-4">{user.Location}</td>
                    <td className="py-3 px-4 font-semibold">{user.Role}</td>
                    <td className="py-3 px-4">
                      <select
                        value={user.Role}
                        onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Citizen">Citizen</option>
                        <option value="Government Official">Government Official</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
