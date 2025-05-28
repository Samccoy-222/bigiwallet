import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, setJustRegistered, mnemonic } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate("/"); // Login success: go to dashboard
      } else {
        await register(email, password);
        // Don't navigate! Wait for user to see mnemonic and click "Continue"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {mnemonic ? (
          <Card className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-full bg-success/20 mb-4">
                <Wallet className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Wallet Created!</h1>
              <p className="text-neutral-400">
                Please save your recovery phrase in a secure location. You'll
                need it to recover your wallet.
              </p>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 mr-2" />
                <p className="text-sm text-warning">
                  Never share your recovery phrase with anyone. Store it
                  securely offline.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-2">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white text-black p-1 rounded-md"
                  >
                    <span className="mr-2 text-xs">{index + 1}.</span>
                    <span className="font-mono">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setJustRegistered();
                navigate("/");
              }}
            >
              Continue to Wallet
            </Button>
          </Card>
        ) : (
          <Card className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 rounded-full bg-primary/20 mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h1>
              <p className="text-neutral-400">
                {isLogin
                  ? "Sign in to access your wallet"
                  : "Register to create your wallet"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-error/10 text-error text-sm p-3 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10 w-full"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10 w-full"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-light text-sm"
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Auth;
