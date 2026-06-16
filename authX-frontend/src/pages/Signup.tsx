import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ShieldCheck } from "lucide-react";
import React, { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import type RegisterData from "@/models/RegisterData";
import { registerUser } from "@/services/AuthService";
import { useNavigate, Link } from "react-router";
import OAuth2Buttons from "../components/OAuth2Buttons";
import { cn } from "@/lib/utils";

function getStrength(p: string): number {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const strengthMeta = [
  { label: "", bar: "" },
  { label: "Weak", bar: "bg-red-500" },
  { label: "Fair", bar: "bg-amber-400" },
  { label: "Good", bar: "bg-lime-500" },
  { label: "Strong", bar: "bg-emerald-500" },
];

function Signup() {
  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((v) => ({ ...v, [e.target.name]: e.target.value }));

  const strength = data.password ? getStrength(data.password) : 0;
  const canSubmit =
    data.name.trim() &&
    data.email.trim() &&
    data.password.length >= 6 &&
    agreed;

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) return toast.error("Name is required.");
    if (!data.email.trim()) return toast.error("Email is required.");
    if (!data.password.trim()) return toast.error("Password is required.");
    if (!agreed) return toast.error("Please accept the terms.");
    try {
      setLoading(true);
      await registerUser(data);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch {
      toast.error("Error registering account.");
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
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium bg-[#EEEDFE] text-violet-700 border border-[#AFA9EC] dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Next-gen authentication
              </span>
            </div>

            <h1 className="text-[22px] font-medium text-center text-gray-900 dark:text-[#F0EFF9] mb-1.5">
              Create your account
            </h1>
            <p className="text-[13px] text-center text-gray-500 dark:text-[#6A6A88] mb-5">
              Join the platform trusted by thousands of developers
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-[12px] font-medium text-gray-500 dark:text-[#9999BB]"
                >
                  Full name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-[#444]" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-9 h-[38px] rounded-[9px] text-[13.5px] bg-[#F7F6FC] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
                    value={data.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[12px] font-medium text-gray-500 dark:text-[#9999BB]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-[#444]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 h-[38px] rounded-[9px] text-[13.5px] bg-[#F7F6FC] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
                    value={data.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password + strength */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-[12px] font-medium text-gray-500 dark:text-[#9999BB]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-[#444]" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 h-[38px] rounded-[9px] text-[13.5px] bg-[#F7F6FC] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
                    value={data.password}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Strength bars */}
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "flex-1 h-[3px] rounded-full transition-all duration-300",
                        data.password
                          ? n <= strength
                            ? strengthMeta[strength].bar
                            : "bg-black/8 dark:bg-white/[0.06]"
                          : "bg-black/8 dark:bg-white/[0.06]",
                      )}
                    />
                  ))}
                </div>
                {data.password && (
                  <p className="text-[11px] text-gray-400 dark:text-[#555]">
                    {strengthMeta[strength].label}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-violet-600 flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-[12px] leading-relaxed text-gray-500 dark:text-[#666]"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-violet-400 hover:text-violet-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-violet-400 hover:text-violet-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                disabled={!canSubmit || loading}
                className="w-full h-10 rounded-[10px] text-[14px] font-medium bg-violet-600 hover:bg-violet-700 text-violet-100 border-violet-400/30 gap-2 disabled:opacity-50 mt-1"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-black/10 dark:bg-white/[0.07]" />
                <span className="text-[12px] text-gray-400 dark:text-[#444]">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-black/10 dark:bg-white/[0.07]" />
              </div>

              <OAuth2Buttons />
            </form>

            <p className="text-[12.5px] text-center text-gray-400 dark:text-[#555] mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-500"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Status bar */}
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

export default Signup;
