import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const KYC: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mockKYCRequests = [
    {
      id: "1",
      user: {
        email: "john@example.com",
        name: "John Doe",
      },
      status: "pending",
      submittedAt: "2024-03-15 14:30",
      documents: ["passport.jpg", "utility_bill.pdf"],
      notes: "Awaiting document verification",
    },
    // Add more mock data as needed
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center text-success">
            <CheckCircle size={16} className="mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-error">
            <XCircle size={16} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center text-warning">
            <Clock size={16} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by user..."
              className="input pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input py-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-800">
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  User
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Submitted
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Documents
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockKYCRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/30"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{request.user.name}</p>
                      <p className="text-sm text-neutral-400">
                        {request.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {request.submittedAt}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {request.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="text-sm text-blue-400 hover:underline cursor-pointer"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default KYC;
