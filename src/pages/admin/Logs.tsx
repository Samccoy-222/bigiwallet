import React, { useState } from "react";
import { Search, Calendar } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const Logs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const mockLogs = [
    {
      id: "1",
      adminUser: "admin@example.com",
      action: "user_block",
      targetUser: "user@example.com",
      details: "Blocked user account due to suspicious activity",
      timestamp: "2024-03-15 14:30:00",
    },
    // Add more mock logs as needed
  ];

  const getActionBadge = (action: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      user_block: { color: "bg-error/20 text-error", label: "User Block" },
      kyc_approve: {
        color: "bg-success/20 text-success",
        label: "KYC Approved",
      },
      password_reset: {
        color: "bg-warning/20 text-warning",
        label: "Password Reset",
      },
      email_change: { color: "bg-info/20 text-info", label: "Email Changed" },
    };

    const badge = badges[action] || {
      color: "bg-neutral-500/20 text-neutral-500",
      label: action,
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search logs..."
              className="input pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input py-2"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="user_block">User Blocks</option>
            <option value="kyc_approve">KYC Approvals</option>
            <option value="password_reset">Password Resets</option>
            <option value="email_change">Email Changes</option>
          </select>
          <Button variant="outline" className="flex items-center">
            <Calendar size={18} className="mr-2" />
            Filter by Date
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto ">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-800">
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Admin
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Action
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Target User
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/30"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{log.adminUser}</span>
                  </td>
                  <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{log.targetUser}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {log.details}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 px-6 py-3 border-t border-neutral-800">
          <span className="text-sm text-neutral-400">
            Showing 1-10 of 100 logs
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Logs;
