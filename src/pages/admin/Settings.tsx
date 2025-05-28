import React, { useState } from "react";
import { Save, RefreshCw, Shield, Bell } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { supabase } from "../../store/authStore";

const Settings: React.FC = () => {
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });

  const [notificationSettings, setNotificationSettings] = useState({
    newUsers: true,
    supportTickets: true,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  const handleSavePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwords.new,
    });
    if (error) {
      toast.error("Failed to update password: " + error.message);
    } else {
      toast.success("Password updated successfully!");
      setPasswords({ new: "", confirm: "" });
    }
  };
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Shield size={20} className="mr-2 text-primary" />
          Security
        </h2>

        <div className="space-y-6">
          {/* Password Change */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Change Password
            </label>
            <div className="space-y-3">
              <input
                type="password"
                name="new"
                className="input w-full"
                placeholder="New Password"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
              <input
                type="password"
                name="confirm"
                className="input w-full"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {/* Recovery Phrase */}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSavePassword}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Bell className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-neutral-400">
                    Receive notifications for{" "}
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toLowerCase())}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="outline" className="text-center">
        <h2 className="text-lg font-medium mb-2">BigiWallet</h2>
        <p className="text-sm text-neutral-400 mb-4">Version 1.0.0</p>
        <button className="text-primary hover:text-primary-light text-sm flex items-center justify-center mx-auto">
          <RefreshCw size={14} className="mr-1" />
          Check for updates
        </button>
      </Card>
    </div>
  );
};

export default Settings;
