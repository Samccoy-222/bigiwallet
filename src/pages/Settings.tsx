import QRCode from "qrcode";
import React, { useState, useEffect } from "react";
import {
  Save,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  QrCode,
  Check,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { supabase, useAuthStore } from "../store/authStore";
import toast, { Toaster } from "react-hot-toast";
import { MoonLoader } from "react-spinners";

export const TotpQr = ({ uri }: { uri: string }) => {
  const [qrSvg, setQrSvg] = useState<string>("");

  useEffect(() => {
    if (!uri) return;
    QRCode.toString(uri, { type: "svg" }).then(setQrSvg);
  }, [uri]);

  return (
    <div
      className="w-[200px] h-[200px] mx-auto mb-4"
      dangerouslySetInnerHTML={{ __html: qrSvg }}
    />
  );
};

const Settings: React.FC = () => {
  const authStore = useAuthStore();
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [totpVerified, setTotpVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);

  const recoveryPhrase =
    authStore.mnemonic ||
    "valley alien library bread worry brother bundle hammer loyal barely dune brave";

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      setTotpVerified(data?.currentLevel === "aal2");
    })();
  }, []);

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

  const handleStart2FA = async () => {
    setMfaLoading(true);
    // Step 1: List current factors
    const { data: factorsData, error: listError } =
      await supabase.auth.mfa.listFactors();

    if (listError) {
      toast.error("Failed to list 2FA factors: " + listError.message);
      return;
    }

    // Step 2: Look for existing TOTP factor
    const existingTotp = factorsData?.all?.find(
      (factor: any) => factor.factor_type === "totp"
    );

    // If it exists, handle accordingly
    if (existingTotp) {
      if (existingTotp.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: existingTotp.id });
      } else {
        toast("TOTP 2FA is already enabled.");
        return;
      }
    }

    // Step 3: Enroll new TOTP factor
    const { data: enrollData, error: enrollError } =
      await supabase.auth.mfa.enroll({
        factorType: "totp",
      });

    if (enrollError) {
      toast.error("Failed to start 2FA: " + enrollError.message);
      return;
    }
    setMfaLoading(false);
    setTotpUri(enrollData.totp.uri);
  };

  const handleVerify2FA = async () => {
    // Step 1: Get list of factors again to find unverified one
    const { data: factorsData, error: listError } =
      await supabase.auth.mfa.listFactors();

    if (listError) {
      toast.error("Failed to get 2FA factors: " + listError.message);
      return;
    }

    // Step 2: Find the unverified TOTP factor
    const totpFactor = factorsData?.all?.find(
      (factor: any) =>
        factor.factor_type === "totp" && factor.status === "unverified"
    );

    if (!totpFactor || !totpFactor.id) {
      toast.error("No unverified TOTP factor found.");
      return;
    }

    // Step 3: Use factor_id in verify call
    // Step 4: Create a challenge to get the challengeId
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

    if (challengeError) {
      toast.error("Failed to create challenge: " + challengeError.message);
      return;
    }

    // Step 5: Use challengeId in the verify call
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challengeData.id,
      code: codeInput,
    });

    if (verifyError) {
      toast.error("Verification failed: " + verifyError.message);
    } else {
      toast.success("2FA enabled successfully!");
      setTotpVerified(true);
      setTotpUri(null);
      setCodeInput("");
    }
  };

  const renderRecoveryPhrase = () =>
    showRecoveryPhrase ? (
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
    );

  const render2FASection = () => {
    if (totpVerified) {
      return (
        <div className="flex items-center space-x-2 text-green-500">
          <Check size={18} />
          <span>2FA is enabled</span>
        </div>
      );
    }

    if (mfaLoading) {
      return (
        <div className="flex justify-center items-center py-4">
          <MoonLoader color="white" />
        </div>
      );
    }
    if (totpUri) {
      return (
        <>
          <TotpQr uri={totpUri} />
          <input
            type="text"
            placeholder="Enter code from app"
            className="input w-full mb-2"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <Button variant="primary" onClick={handleVerify2FA}>
            <Check size={16} className="mr-2" />
            Verify & Enable
          </Button>
        </>
      );
    }

    return (
      <Button variant="outline" onClick={handleStart2FA}>
        <QrCode size={16} className="mr-2" />
        Setup 2FA
      </Button>
    );
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Security Card */}
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
            {renderRecoveryPhrase()}
          </div>

          {/* 2FA Section */}

          <div className="pt-4 border-t border-neutral-800">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Two-Factor Authentication
            </label>

            {render2FASection()}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSavePassword}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card variant="outline" className="text-center">
        <h2 className="text-lg font-medium mb-2">BigiWallet</h2>
        <p className="text-sm text-neutral-400 mb-4">Version 1.0.0</p>
        <button className="text-primary hover:text-primary-light text-sm flex items-center justify-center mx-auto">
          <RefreshCw size={14} className="mr-1" />
          Check for updates
        </button>
      </Card>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Settings;
