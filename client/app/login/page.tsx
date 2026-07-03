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
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Building className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 dark:text-blue-450 hover:underline">
              create a new profile
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-950 focus:outline-none focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div className="space-y-1 relative">
            <label htmlFor="password" className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-zinc-950 focus:outline-none focus:border-blue-500 text-sm"
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
            className="w-full py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

      </div>
    </div>
  );
}
