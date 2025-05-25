import React, { useState } from "react";
import {
  Save,
  Moon,
  Sun,
  Bell,
  Shield,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { supabase, useAuthStore } from "../store/authStore";

const Settings: React.FC = () => {
  const authStore = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [passwords, setPaasswords] = useState({
    new: "",
    confirm: "",
  });
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    security: true,
  });

  // Mock recovery phrase
  const recoveryPhrase =
    authStore.mnemonic ||
    "valley alien library bread worry brother bundle hammer loyal barely dune brave";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) {
        console.error("Password update failed:", error.message);
        alert("Failed to update password: " + error.message);
      } else {
        alert("Password updated successfully!");
        setPaasswords({ new: "", confirm: "" });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Security Section */}
      <Card>
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Shield size={20} className="mr-2 text-primary" />
          Security
        </h2>

        <div className="space-y-6">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-neutral-300">
                Recovery Phrase
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
              >
                {showRecoveryPhrase ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
            {showRecoveryPhrase ? (
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <div className="grid grid-cols-3 gap-2">
                  {recoveryPhrase.split(" ").map((word, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-neutral-400 mr-2 text-xs">
                        {index + 1}.
                      </span>
                      <span>{word}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-warning text-sm">
                  Never share your recovery phrase with anyone!
                </div>
              </div>
            ) : (
              <div className="p-4 bg-neutral-800/50 rounded-lg text-center">
                <p className="text-sm text-neutral-400">
                  Click the eye icon to reveal your recovery phrase
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <Button
              variant="outline"
              onClick={() => alert("2FA Setup coming soon!")}
              className="mr-2"
            >
              <Key size={16} className="mr-2" />
              Setup 2FA
            </Button>

            <Button variant="primary" onClick={handleSaveChanges}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card>
        <h2 className="text-lg font-semibold mb-6">Preferences</h2>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-neutral-400">
                Enable dark mode for the application
              </p>
            </div>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                isDarkMode ? "bg-primary" : "bg-neutral-700"
              }`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <div className="flex justify-between px-1 items-center h-full">
                <Moon size={12} className="text-white" />
                <Sun size={12} className="text-white" />
              </div>
              <div
                className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                }`}
                style={{ marginTop: "-16px" }}
              ></div>
            </button>
          </div>

          {/* Notification Toggles */}
          <div className="space-y-4">
            <p className="font-medium flex items-center">
              <Bell size={16} className="mr-2 text-primary" />
              Notifications
            </p>

            {/* Transaction Notifications */}
            <div className="flex justify-between items-center ml-6">
              <div>
                <p className="text-sm">Transaction Updates</p>
                <p className="text-xs text-neutral-400">
                  Get notified about your transactions
                </p>
              </div>
              <button
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  notifications.transactions ? "bg-primary" : "bg-neutral-700"
                }`}
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    transactions: !notifications.transactions,
                  })
                }
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    notifications.transactions
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Marketing Notifications */}
            <div className="flex justify-between items-center ml-6">
              <div>
                <p className="text-sm">Marketing</p>
                <p className="text-xs text-neutral-400">
                  Receive news and promotions
                </p>
              </div>
              <button
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  notifications.marketing ? "bg-primary" : "bg-neutral-700"
                }`}
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    marketing: !notifications.marketing,
                  })
                }
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    notifications.marketing ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Security Notifications */}
            <div className="flex justify-between items-center ml-6">
              <div>
                <p className="text-sm">Security Alerts</p>
                <p className="text-xs text-neutral-400">
                  Important security notifications
                </p>
              </div>
              <button
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  notifications.security ? "bg-primary" : "bg-neutral-700"
                }`}
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    security: !notifications.security,
                  })
                }
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                    notifications.security ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <Button
              variant="primary"
              onClick={() => alert("Preferences saved!")}
              fullWidth
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card variant="outline" className="text-center">
        <h2 className="text-lg font-medium mb-2">BigiWallet</h2>
        <p className="text-sm text-neutral-400 mb-4">Version 1.0.0</p>
        <button className="text-primary hover:text-primary-light text-sm flex items-center justify-center mx-auto">
          <RefreshCw size={14} className="mr-1" /> Check for updates
        </button>
      </Card>
    </div>
  );
};

export default Settings;
