import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, MoreVertical, Shield, Ban, Mail } from "lucide-react";
import Card from "../../components/ui/Card";
import { useAdminStore } from "../../store/adminStore";

type User = {
  id: string;
  email: string;
  username: string;
  kycStatus: "verified" | "pending";
  walletBalance: string;
  lastLogin: string;
};

const UserActions = () => (
  <div className="flex items-center space-x-2">
    <button className="p-1 hover:bg-neutral-700 rounded-lg transition-colors">
      <Shield size={18} className="text-primary" />
    </button>
    <button className="p-1 hover:bg-neutral-700 rounded-lg transition-colors">
      <Ban size={18} className="text-error" />
    </button>
    <button className="p-1 hover:bg-neutral-700 rounded-lg transition-colors">
      <Mail size={18} className="text-neutral-400" />
    </button>
    <button className="p-1 hover:bg-neutral-700 rounded-lg transition-colors">
      <MoreVertical size={18} className="text-neutral-400" />
    </button>
  </div>
);

const UserRow: React.FC<{ user: User }> = ({ user }) => (
  <tr className="border-b border-neutral-800 hover:bg-neutral-800/30">
    <td className="px-4 sm:px-6 py-3">
      <p className="font-medium">{user.username}</p>
      <p className="text-xs text-neutral-400">{user.email}</p>
    </td>
    <td className="px-4 sm:px-6 py-3">
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          user.kycStatus === "verified" || true
            ? "bg-success/20 text-success"
            : "bg-warning/20 text-warning"
        }`}
      >
        {user.kycStatus || "verified"}
      </span>
    </td>
    <td className="px-4 sm:px-6 py-3">{user.walletBalance}</td>
    <td className="px-4 sm:px-6 py-3 text-xs text-neutral-400">
      {user.lastLogin}
    </td>
    <td className="px-4 sm:px-6 py-3">
      <UserActions />
    </td>
  </tr>
);

const Users: React.FC = () => {
  const { users, fetchUsers } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const renderRef = useRef(false);

  useEffect(() => {
    if (renderRef.current) return;
    renderRef.current = true;
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Users Management</h1>

        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="input w-full pl-10 pr-4 py-2 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-800">
                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-neutral-400">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-neutral-400">
                  KYC
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-neutral-400">
                  Balance
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-neutral-400">
                  Last Login
                </th>
                <th className="px-4 sm:px-6 py-3 text-xs font-medium text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-neutral-500 py-6 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Users;
