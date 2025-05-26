import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Ticket, AlertTriangle, Activity } from "lucide-react";
import Card from "../../components/ui/Card";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Open Tickets",
      value: "23",
      change: "-5%",
      icon: Ticket,
      path: "/admin/tickets",
    },
    {
      title: "Pending KYC",
      value: "45",
      change: "+8%",
      icon: AlertTriangle,
      path: "/admin/kyc",
    },
    {
      title: "Active Sessions",
      value: "892",
      change: "+3%",
      icon: Activity,
      path: "/admin/activity",
    },
  ];

  return (
    <div className="p-2 py-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => navigate(stat.path)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-400 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      stat.change.startsWith("+")
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {stat.change} from last week
                  </p>
                </div>
                <Icon className="text-primary" size={24} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Support Tickets</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-neutral-800"
              >
                <div>
                  <p className="font-medium">Wallet Connection Issue</p>
                  <p className="text-sm text-neutral-400">User ID: #1234</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-warning/20 text-warning">
                  High Priority
                </span>
              </div>
            ))}
          </div>
          <button
            className="mt-4 text-primary hover:text-primary-light text-sm"
            onClick={() => navigate("/admin/tickets")}
          >
            View All Tickets
          </button>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Admin Actions</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-neutral-800"
              >
                <div>
                  <p className="font-medium">User Account Updated</p>
                  <p className="text-sm text-neutral-400">Admin: John Doe</p>
                </div>
                <span className="text-sm text-neutral-400">2 hours ago</span>
              </div>
            ))}
          </div>
          <button
            className="mt-4 text-primary hover:text-primary-light text-sm"
            onClick={() => navigate("/admin/logs")}
          >
            View All Actions
          </button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
