import { NavLink } from "react-router";
import { Button } from "./ui/button";
import {
  Home,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <div className="px-4 py-3">
      <nav className="relative flex h-14 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 backdrop-blur-sm dark:bg-gray-950/80">
        {/* Top accent line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-violet-600 text-[13px] font-semibold tracking-tight text-violet-200">
            AX
            <span className="absolute inset-[-1px] rounded-[9px] border border-violet-400/30" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Auth<span className="text-violet-400">X</span>
          </span>
        </NavLink>

        {/* Center nav pill */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-xl border border-gray-200/10 bg-gray-100/60 p-1 dark:bg-gray-900/60">
          {[
            { to: "/", label: "Home", icon: Home },
            { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { to: "/security", label: "Security", icon: ShieldCheck },
          ].map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13.5px] font-medium transition-colors",
                    isActive
                      ? "border border-gray-200/20 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NavLink to="/login">
            <Button variant="ghost" size="sm" className="gap-1.5 text-[13.5px]">
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Button>
          </NavLink>
          <NavLink to="/signup">
            <Button
              size="sm"
              className="gap-1.5 bg-violet-600 text-[13.5px] text-violet-100 hover:bg-violet-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Sign up
            </Button>
          </NavLink>
        </div>
      </nav>

      {/* Status bar */}
      <div className="mt-2 flex items-center gap-2 px-1">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px] text-gray-400">System operational</span>
        <span className="h-2.5 w-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-[11px] text-gray-400">AUTH v2.4.1</span>
        <span className="h-2.5 w-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-[11px] text-gray-400">
          256-bit encryption active
        </span>
      </div>

      {/* Scan line accent */}
      <div className="mt-1.5 h-px rounded bg-gradient-to-r from-transparent via-violet-500 to-emerald-500 opacity-30" />
    </div>
  );
};

export default Navbar;
