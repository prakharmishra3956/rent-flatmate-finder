"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/authService";
import { toast } from "react-hot-toast";
import { Loader2, Building, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Welcome back!");
      if (data.user.role === "owner") {
        router.push("/owner/dashboard");
      } else if (data.user.role === "tenant") {
        router.push("/tenant/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Invalid email or password";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Building className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Or{" "}
            <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              create a new profile
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-1.5 relative">
            <label htmlFor="password" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

      </div>
    </div>
  );
}
