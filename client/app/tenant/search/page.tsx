"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TenantSidebar from "../../../components/Tenant/TenantSidebar";
import { searchListings } from "../../../services/listingService";
import { getCurrentUser } from "../../../services/authService";
import { Loader2, Search, MapPin, DollarSign, BedDouble, ShieldCheck, Clipboard } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Filter States
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [maxRent, setMaxRent] = useState("");

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

  // Fetch filtered listings
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["searchListings", location, roomType, furnishing, maxRent],
    queryFn: () => 
      searchListings({
        location: location || undefined,
        roomType: roomType || undefined,
        furnishing: furnishing || undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
      }),
    enabled: !isCheckingAuth,
  });

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  const listings = searchData?.listings || [];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TenantSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Rooms</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Find and filter available rental spaces in your target area
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search city, neighborhood, or address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Max Rent */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Max Monthly Rent ($)</label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              >
                <option value="">Any Room Type</option>
                <option value="Single">Single Room</option>
                <option value="Double">Double Room</option>
                <option value="Shared">Shared Room</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              >
                <option value="">Any Furnishing</option>
                <option value="Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Available Rooms ({listings.length})</h2>

          {searchLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => {
                const imageUrl = listing.photos && listing.photos.length > 0 
                  ? listing.photos[0].url 
                  : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

                return (
                  <Link 
                    key={listing._id}
                    href={`/listings/${listing._id}`}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={listing.title}
                        className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-300"
                      />
                      
                      {/* Status */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm bg-emerald-500 text-white`}>
                          {listing.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{listing.location}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{listing.roomType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{listing.furnishing}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${listing.rent}</span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[10px]">/ month</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Clipboard className="h-10 w-10 mx-auto text-zinc-400 dark:text-zinc-600" />
              <p className="mt-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">No rooms match your criteria</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try relaxing some of your filters or clearing search text.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
