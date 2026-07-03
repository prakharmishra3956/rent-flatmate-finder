"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TenantSidebar from "../../../components/Tenant/TenantSidebar";
import { getTenantProfile, getCompatibilityScore } from "../../../services/tenantService";
import { searchListings } from "../../../services/listingService";
import { getCurrentUser } from "../../../services/authService";
import { Loader2, Sparkles, MapPin, Compass, DollarSign, ArrowRight, User } from "lucide-react";
import Link from "next/link";

// Child component to display the listing recommendation card with AI Compatibility Score badge
function RecommendedCard({ listing }: { listing: any }) {
  const { data: compatibility, isLoading } = useQuery({
    queryKey: ["compatibilityScore", listing._id],
    queryFn: () => getCompatibilityScore(listing._id),
  });

  const imageUrl = listing.photos && listing.photos.length > 0 
    ? listing.photos[0].url 
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

  return (
    <Link 
      href={`/listings/${listing._id}`}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative"
    >
      <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-300"
        />

        {/* Compatibility badge */}
        {!isLoading && compatibility && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-extrabold shadow flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-white" />
              <span>{compatibility.score}% Match</span>
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {listing.title}
          </h4>
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        </div>
        <div className="pt-1 flex items-baseline gap-1 border-t border-zinc-100 dark:border-zinc-800/80 mt-1">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">${listing.rent}</span>
          <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">/ month</span>
        </div>
      </div>
    </Link>
  );
}

export default function TenantDashboard() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth
  useEffect(() => {
    const user = getCurrentUser();
    const token = localStorage.getItem("token");
    if (!token || !user || user.role !== "tenant") {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Fetch Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["tenantProfile"],
    queryFn: getTenantProfile,
    enabled: !isCheckingAuth,
  });

  // Fetch Recommended Listings based on profile criteria
  const { data: recommendedData, isLoading: isListingsLoading } = useQuery({
    queryKey: ["recommendedListings", profile?.preferredLocation, profile?.budgetMax],
    queryFn: () => 
      searchListings({
        location: profile?.preferredLocation,
        maxRent: profile?.budgetMax,
      }),
    enabled: !!profile,
  });

  if (isCheckingAuth || isProfileLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading your space...</p>
        </div>
      </div>
    );
  }

  const recommendations = recommendedData?.listings || [];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TenantSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Find compatible flatmates and rooms based on your preferences
          </p>
        </div>

        {/* Setup Profile Callout if not setup */}
        {!profile ? (
          <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">Define Your Roommate Preferences</h2>
              <p className="text-sm text-zinc-650 dark:text-zinc-450 max-w-lg">
                Specify your location preferences, rent budget, and preferred amenities. We'll use this to match you with compatible rooms.
              </p>
            </div>
            <Link
              href="/tenant/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-500/10 cursor-pointer"
            >
              <span>Setup Profile Preferences</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preferences Summary Card */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6 h-fit">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                <h3 className="font-bold text-lg">My Match Criteria</h3>
                <Link href="/tenant/profile" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Edit
                </Link>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Location</p>
                    <p className="font-semibold">{profile.preferredLocation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Monthly Budget</p>
                    <p className="font-semibold">${profile.budgetMin} - ${profile.budgetMax}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Preferred Room Type</p>
                    <p className="font-semibold">{profile.preferredRoomType} Room</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Recommended Spaces for You</h3>
              </div>

              {isListingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((listing: any) => (
                    <RecommendedCard key={listing._id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <Compass className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600" />
                  <p className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">No matching spaces found</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try expanding your preferred locations or budget range</p>
                  <Link
                    href="/tenant/search"
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all"
                  >
                    <span>Browse All Rooms</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
