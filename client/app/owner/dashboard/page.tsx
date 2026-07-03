"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../../components/Owner/Sidebar";
import DashboardCard from "../../../components/Owner/DashboardCard";
import ListingCard from "../../../components/Owner/ListingCard";
import { getOwnerStats } from "../../../services/dashboardService";
import { getMyListings, deleteListing, markListingFilled } from "../../../services/listingService";
import { getCurrentUser } from "../../../services/authService";
import { 
  Building2, 
  CheckCircle, 
  HelpCircle, 
  Users, 
  Plus, 
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OwnerDashboard() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth
  useEffect(() => {
    const user = getCurrentUser();
    const token = localStorage.getItem("token");
    if (!token || !user || user.role !== "owner") {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Fetch Stats
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["ownerStats"],
    queryFn: getOwnerStats,
    enabled: !isCheckingAuth,
  });

  // Fetch Listings
  const { data: listings, isLoading: listingsLoading, refetch: refetchListings } = useQuery({
    queryKey: ["ownerListings"],
    queryFn: getMyListings,
    enabled: !isCheckingAuth,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        toast.success("Listing deleted successfully");
        refetchListings();
        refetchStats();
      } catch (err) {
        toast.error("Failed to delete listing");
      }
    }
  };

  const handleMarkFilled = async (id: string) => {
    try {
      await markListingFilled(id);
      toast.success("Listing marked as filled");
      refetchListings();
      refetchStats();
    } catch (err) {
      toast.error("Failed to mark listing as filled");
    }
  };

  if (isCheckingAuth || statsLoading || listingsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const recentListings = listings?.slice(0, 3) || [];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage your properties and flatmate requests
            </p>
          </div>
          <Link
            href="/owner/add-listing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Listing</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Listings"
            value={stats?.total ?? 0}
            icon={Building2}
            color="blue"
          />
          <DashboardCard
            title="Available Rooms"
            value={stats?.available ?? 0}
            icon={CheckCircle}
            color="green"
          />
          <DashboardCard
            title="Filled Rooms"
            value={stats?.filled ?? 0}
            icon={HelpCircle}
            color="amber"
          />
          <DashboardCard
            title="Pending Requests"
            value={stats?.requests ?? 0}
            icon={Users}
            color="indigo"
          />
        </div>

        {/* Recent Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent Listings</h2>
            {listings && listings.length > 3 && (
              <Link href="/owner/my-listings" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View All Listings ({listings.length})
              </Link>
            )}
          </div>

          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing: any) => (
                <div key={listing._id}>
                  <ListingCard
                    listing={listing}
                    onDelete={handleDelete}
                    onMarkFilled={handleMarkFilled}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Building2 className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600" />
              <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">No properties listed yet</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Get started by creating your first property post</p>
              <Link
                href="/owner/add-listing"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Listing</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
