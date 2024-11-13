"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  fetchedAt: string;
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://backendalaahd.onrender.com/api/allusers');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-200">
        <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">Username</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Phone</th>
            <th scope="col" className="px-6 py-3">Date Registered</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-100' : 'bg-green-100 text-green-600 dark:bg-green-500 dark:text-green-100'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{new Date(user.fetchedAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
