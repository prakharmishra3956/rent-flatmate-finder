"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { 
  getAdminStats, 
  getAdminUsers, 
  deleteAdminUser, 
  getAdminListings, 
  deleteAdminListing, 
  toggleAdminListingFilled 
} from "../../../services/adminService";
import { getCurrentUser, logoutUser } from "../../../services/authService";
import { 
  LayoutDashboard, 
  Users, 
  List, 
  Building, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ShieldAlert,
  DollarSign,
  MapPin,
  Calendar
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "users" | "listings";

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // 1. Auth Guard
  useEffect(() => {
    const user = getCurrentUser();
    const token = localStorage.getItem("token");
    if (!token || !user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      router.push("/login");
    } else {
      setAdminUser(user);
      setIsCheckingAuth(false);
    }
  }, [router]);

  // 2. Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    enabled: !isCheckingAuth && activeTab === "overview",
  });

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAdminUsers,
    enabled: !isCheckingAuth && activeTab === "users",
  });

  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: ["adminListings"],
    queryFn: getAdminListings,
    enabled: !isCheckingAuth && activeTab === "listings",
  });

  // 3. Mutations
  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("User deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  });

  const deleteListingMutation = useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Listing deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  });

  const toggleListingFilledMutation = useMutation({
    mutationFn: toggleAdminListingFilled,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success(`Listing status updated to ${updated.status}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update listing");
    }
  });

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"? This will delete all their listings, profiles, and requests.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleDeleteListing = (listingId: string, listingTitle: string) => {
    if (confirm(`Are you sure you want to delete room listing "${listingTitle}"?`)) {
      deleteListingMutation.mutate(listingId);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="h-6 w-6" />
            <span>Admin Center</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "listings"
                ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <Building className="h-5 w-5" />
            <span>Manage Listings</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">
                {adminUser?.name || "Administrator"}
              </p>
              <p className="text-xs truncate text-zinc-500 dark:text-zinc-400">
                System Admin
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Control Panel</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              System monitoring, users clearance, and listing management
            </p>
          </div>
          <div className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-900 flex items-center gap-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Server Online</span>
          </div>
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {isStatsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stats Card: Total Users */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 font-medium">Total Registered Users</p>
                    <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                {/* Stats Card: Total Listings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 font-medium">Total Flat Listings</p>
                    <p className="text-3xl font-bold">{stats?.totalListings || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-400 flex items-center justify-center">
                    <Building className="h-6 w-6" />
                  </div>
                </div>

                {/* Stats Card: Filled Listings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 font-medium">Filled Listings</p>
                    <p className="text-3xl font-bold">{stats?.filledListings || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>

                {/* Stats Card: Pending Interests */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 font-medium">Pending Match Requests</p>
                    <p className="text-3xl font-bold">{stats?.pendingInterests || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <List className="h-6 w-6" />
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <h3 className="font-bold text-lg">System Users</h3>
            </div>
            
            {isUsersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-850">
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Role</th>
                      <th className="px-6 py-3 font-semibold">Registered</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {users.map((u: any) => (
                      <tr key={u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">{u.name}</td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === "admin" 
                              ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900"
                              : u.role === "owner"
                              ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                              : "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900"
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            disabled={u._id === adminUser?.id || deleteUserMutation.isPending}
                            className="p-1.5 text-zinc-450 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">No users found.</div>
            )}
          </div>
        )}

        {/* --- LISTINGS TAB --- */}
        {activeTab === "listings" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <h3 className="font-bold text-lg">Platform Room Listings</h3>
            </div>
            
            {isListingsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : listings && listings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-850">
                      <th className="px-6 py-3 font-semibold">Title</th>
                      <th className="px-6 py-3 font-semibold">Owner</th>
                      <th className="px-6 py-3 font-semibold">Location</th>
                      <th className="px-6 py-3 font-semibold">Monthly Rent</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {listings.map((l: any) => (
                      <tr key={l._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">{l.title}</p>
                          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{l.roomType} Room</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs">{l.owner?.name}</p>
                          <p className="text-[10px] text-zinc-450 dark:text-zinc-500">{l.owner?.email}</p>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{l.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-650 dark:text-indigo-400">${l.rent}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            l.status === "Available" 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            
                            {/* Toggle availability */}
                            <button
                              onClick={() => toggleListingFilledMutation.mutate(l._id)}
                              disabled={toggleListingFilledMutation.isPending}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                l.status === "Available"
                                  ? "border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-600"
                                  : "border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600"
                              }`}
                              title={l.status === "Available" ? "Mark Filled" : "Mark Available"}
                            >
                              {l.status === "Available" ? (
                                <XCircle className="h-4.5 w-4.5" />
                              ) : (
                                <CheckCircle className="h-4.5 w-4.5" />
                              )}
                            </button>

                            {/* Delete listing */}
                            <button
                              onClick={() => handleDeleteListing(l._id, l.title)}
                              disabled={deleteListingMutation.isPending}
                              className="p-1.5 text-zinc-450 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900 transition-all cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">No room listings found.</div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
