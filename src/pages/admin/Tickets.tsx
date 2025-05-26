import React, { useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const Tickets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mockTickets = [
    {
      id: "1",
      subject: "Cannot access wallet",
      user: "john@example.com",
      status: "open",
      priority: "high",
      created: "2024-03-15 14:30",
      lastUpdate: "2024-03-15 15:45",
    },
    // Add more mock tickets as needed
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search tickets..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-neutral-800">
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Ticket
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Status
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Priority
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Created
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Last Update
                </th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/30"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-neutral-400">{ticket.user}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === "open"
                          ? "bg-warning/20 text-warning"
                          : ticket.status === "in_progress"
                          ? "bg-primary/20 text-primary"
                          : "bg-success/20 text-success"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === "high"
                          ? "bg-error/20 text-error"
                          : ticket.priority === "medium"
                          ? "bg-warning/20 text-warning"
                          : "bg-success/20 text-success"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {ticket.created}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-400">
                      {ticket.lastUpdate}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Reply
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800">
          <p className="text-sm text-neutral-400">Showing 1-10 of 50 tickets</p>
          <div className="flex items-center space-x-2">
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

export default Tickets;
