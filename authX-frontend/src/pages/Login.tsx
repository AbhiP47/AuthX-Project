import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Github, AlertCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import type LoginData from "@/models/LoginData";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/store";
import OAuth2Buttons from "../components/OAuth2Buttons";

function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) {
      toast.error("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err);
      toast.error("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0EFF7] dark:bg-[#0D0D12] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Brand mark */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="relative w-[28px] h-[28px] rounded-[7px] bg-violet-600 flex items-center justify-center text-[12px] font-semibold text-violet-200 flex-shrink-0">
            AX
            <span className="absolute inset-[-1px] rounded-[8px] border border-violet-400/30" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-[#F0EFF9]">
            Auth<span className="text-violet-400">X</span>
          </span>
        </div>

        <Card className="relative overflow-hidden rounded-2xl border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-none">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <CardContent className="pt-7 pb-6 px-6">
            <h1 className="text-[22px] font-medium text-center text-gray-900 dark:text-[#F0EFF9] mb-1.5">
              Welcome back
            </h1>
            <p className="text-[13.5px] text-center text-gray-500 dark:text-[#6A6A88] mb-6">
              Login to access your authentication app
            </p>

            {error && (
              <Alert variant="destructive" className="mb-4 py-2.5 text-[13px]">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-[13px] font-medium">
                  {error?.response?.data?.message ??
                    error?.message ??
                    "Something went wrong"}
                </AlertTitle>
              </Alert>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[12px] font-medium text-gray-500 dark:text-[#9999BB]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#555]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 h-[38px] rounded-[9px] text-[13.5px] bg-[#F7F6FC] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
                    value={loginData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-[12px] font-medium text-gray-500 dark:text-[#9999BB]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#555]" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 h-[38px] rounded-[9px] text-[13.5px] bg-[#F7F6FC] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
                    value={loginData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-[12px] text-violet-400 hover:text-violet-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                disabled={loading}
                className="w-full h-10 rounded-[10px] text-[14px] font-medium bg-violet-600 hover:bg-violet-700 text-violet-100 border-violet-400/30 mt-1 gap-2"
              >
                {loading ? (
                  <>
                    <Spinner /> Verifying...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Login
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-black/10 dark:bg-white/[0.08]" />
                <span className="text-[12px] text-gray-400 dark:text-[#555]">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-black/10 dark:bg-white/[0.08]" />
              </div>

              <OAuth2Buttons />
            </form>

            <p className="text-[12.5px] text-center text-gray-400 dark:text-[#555] mt-5">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-violet-400 hover:text-violet-500"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Status bar — matches navbar */}
        <div className="flex items-center gap-2 mt-3 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-gray-400 dark:text-[#444]">
            System operational
          </span>
          <span className="w-px h-2.5 bg-gray-300 dark:bg-white/10" />
          <span className="text-[11px] text-gray-400 dark:text-[#444]">
            AUTH v2.4.1
          </span>
          <span className="w-px h-2.5 bg-gray-300 dark:bg-white/10" />
          <span className="text-[11px] text-gray-400 dark:text-[#444]">
            256-bit encryption active
          </span>
        </div>
        <div className="mt-1.5 h-px rounded bg-gradient-to-r from-transparent via-violet-500 to-emerald-500 opacity-30" />
      </motion.div>
    </div>
  );
}

export default Login;
