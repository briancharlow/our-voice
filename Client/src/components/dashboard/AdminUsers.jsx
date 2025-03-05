// components/dashboard/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, UserCheck, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'Email', direction: 'ascending' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://16.171.28.194/users/getUsers', {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.Users);
        setFilteredUsers(data.Users);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter and sort users when searchTerm, filterRole, or users change
    let result = [...users];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(user => 
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by role
    if (filterRole !== 'All') {
      result = result.filter(user => user.Role === filterRole);
    }
    
    // Sort users
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, searchTerm, filterRole, sortConfig]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch('http://16.171.28.194/users/update-role', {
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
      setMessage('User role updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    fetchUsers();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="p-3 mb-4 flex items-center gap-2 text-white bg-green-500 rounded-md animate-fadeIn">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}
      
      {error && (
        <div className="p-3 mb-4 flex items-center gap-2 text-white bg-red-500 rounded-md animate-fadeIn">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="All">All Roles</option>
              <option value="Citizen">Citizen</option>
              <option value="Government Official">Government Official</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('Email')}
                  >
                    Email {getSortIndicator('Email')}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('Location')}
                  >
                    Location {getSortIndicator('Location')}
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('Role')}
                  >
                    Role {getSortIndicator('Role')}
                  </th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.Id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{user.Email}</td>
                    <td className="py-3 px-4">{user.Location || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${user.Role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                          user.Role === 'Government Official' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}
                      >
                        {user.Role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-gray-400" />
                        <select
                          value={user.Role}
                          onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Citizen">Citizen</option>
                          <option value="Government Official">Government Official</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;