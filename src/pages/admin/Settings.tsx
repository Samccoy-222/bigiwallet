import React, { useState } from "react";
import { Save, Shield, Mail, Bell } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const Settings: React.FC = () => {
  const [emailSettings, setEmailSettings] = useState({
    supportEmail: "support@example.com",
    notificationEmail: "notifications@example.com",
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newUsers: true,
    kycRequests: true,
    supportTickets: true,
    securityAlerts: true,
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      {/* Email Settings */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Mail className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Email Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Support Email Address
              </label>
              <input
                type="email"
                className="input w-full"
                value={emailSettings.supportEmail}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    supportEmail: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Notification Email Address
              </label>
              <input
                type="email"
                className="input w-full"
                value={emailSettings.notificationEmail}
                onChange={(e) =>
                  setEmailSettings((prev) => ({
                    ...prev,
                    notificationEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Security Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Two-Factor Authentication</p>
                <p className="text-sm text-neutral-400">
                  Enforce 2FA for all admin accounts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.requireTwoFactor}
                  onChange={(e) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      requireTwoFactor: e.target.checked,
                    }))
                  }
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                className="input w-full"
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    sessionTimeout: parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                className="input w-full"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    maxLoginAttempts: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
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
                    Receive notifications for {key.toLowerCase()}
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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center">
          <Save size={18} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
