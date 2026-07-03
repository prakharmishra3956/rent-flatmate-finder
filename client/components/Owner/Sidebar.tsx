"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  LogOut, 
  User, 
  Building,
  MessageSquare
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../../services/authService";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
    { name: "My Listings", href: "/owner/my-listings", icon: Home },
    { name: "Add Listing", href: "/owner/add-listing", icon: PlusCircle },
    { name: "Match Requests", href: "/owner/requests", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Header / Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/owner/dashboard" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
          <Building className="h-6 w-6" />
          <span>Flatmate Finder</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section / Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        {currentUser && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">
                {currentUser.name}
              </p>
              <p className="text-xs truncate text-zinc-500 dark:text-zinc-400">
                {currentUser.role === "owner" ? "Property Owner" : currentUser.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
