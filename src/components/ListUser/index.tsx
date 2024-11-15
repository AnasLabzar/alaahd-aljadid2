"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [error, setError] = useState<string>("");

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backendalaahd.onrender.com/api/allusers"
        );
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const getRoleDetails = (role: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", color: "bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-100" };
      case "fourn":
        return { label: "Fournisseur", color: "bg-purple-100 text-purple-600 dark:bg-purple-500 dark:text-purple-100" };
      case "custom":
        return { label: "Client", color: "bg-green-100 text-green-600 dark:bg-green-500 dark:text-green-100" };
      case "moder":
        return { label: "Moderateur", color: "bg-orange-100 text-orange-600 dark:bg-orange-500 dark:text-orange-100" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-100" };
    }
  };

  const handleUpdate = (id: string) => {
    console.log(`Update user with ID: ${id}`);
    // Implement your update logic here
  };

  const handleView = (id: string) => {
    console.log(`View user with ID: ${id}`);
    // Implement your view logic here
  };

  const handleArchive = (id: string) => {
    console.log(`Archive user with ID: ${id}`);
    // Implement your archive logic here
  };

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
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => {
              const { label, color } = getRoleDetails(user.role);
              return (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${color}`}
                    >
                      {label}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">
                    {new Date(user.fetchedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleView(user._id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleArchive(user._id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
