"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "green" | "amber" | "indigo";
}

export default function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue" 
}: DashboardCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/30",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/30",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/30",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-900/30",
    },
  };

  const style = colorStyles[color];

  return (
    <div className={`p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:shadow-md`}>
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
