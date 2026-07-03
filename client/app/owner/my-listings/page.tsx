"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../../components/Owner/Sidebar";
import ListingCard from "../../../components/Owner/ListingCard";
import { getMyListings, deleteListing, markListingFilled } from "../../../services/listingService";
import { getCurrentUser } from "../../../services/authService";
import { Loader2, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function MyListingsPage() {
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

  // Fetch Listings
  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ["ownerListings"],
    queryFn: getMyListings,
    enabled: !isCheckingAuth,
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        toast.success("Listing deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete listing");
      }
    }
  };

  const handleMarkFilled = async (id: string) => {
    try {
      await markListingFilled(id);
      toast.success("Listing marked as filled");
      refetch();
    } catch (err) {
      toast.error("Failed to mark listing as filled");
    }
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage and update your active property listings
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

        {/* Listings Grid */}
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
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
          <div className="text-center py-24 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Building2 className="h-12 w-12 mx-auto text-zinc-400 dark:text-zinc-600" />
            <p className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">You haven't listed any properties yet</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Create listings to let potential flatmates and tenants browse your spaces.
            </p>
            <Link
              href="/owner/add-listing"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Listing</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
