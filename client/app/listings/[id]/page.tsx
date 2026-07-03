"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getListing } from "../../../services/listingService";
import { 
  getCompatibilityScore, 
  expressInterest, 
  getSentInterests 
} from "../../../services/tenantService";
import { getCurrentUser } from "../../../services/authService";
import { 
  Loader2, 
  MapPin, 
  Calendar, 
  BedDouble, 
  ShieldCheck, 
  Users, 
  User, 
  Mail, 
  ArrowLeft,
  Sparkles,
  Heart,
  MessageSquare
} from "lucide-react";
import { toast } from "react-hot-toast";

interface ListingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [interestMessage, setInterestMessage] = useState("Hi, I am highly interested in this room and would love to chat!");
  const [showInterestModal, setShowInterestModal] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const isTenant = currentUser?.role === "tenant";

  // 1. Fetch listing details
  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ["publicListing", id],
    queryFn: () => getListing(id),
    enabled: !!id,
  });

  // 2. Fetch compatibility score if current user is a tenant
  const { data: compatibility, isLoading: isCompLoading } = useQuery({
    queryKey: ["compatibilityScore", id],
    queryFn: () => getCompatibilityScore(id),
    enabled: !!id && isTenant,
  });

  // 3. Fetch sent interests to check if already applied
  const { data: sentInterests, refetch: refetchSentInterests } = useQuery({
    queryKey: ["sentInterests"],
    queryFn: getSentInterests,
    enabled: !!id && isTenant,
  });

  const expressInterestMutation = useMutation({
    mutationFn: (msg: string) => expressInterest(id, msg),
    onSuccess: () => {
      toast.success("Interest expressed successfully!");
      setShowInterestModal(false);
      refetchSentInterests();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to express interest";
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 space-y-4">
        <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">Listing not found or failed to load</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const imageUrl = listing.photos && listing.photos.length > 0 
    ? listing.photos[0].url 
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80";

  const availableDate = listing.availableFrom
    ? new Date(listing.availableFrom).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Immediate";

  // Check if tenant has already applied to this listing
  const existingRequest = sentInterests?.find(
    (item: any) => item.listing?._id === id || item.listing === id
  );

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    expressInterestMutation.mutate(interestMessage);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50 flex items-center px-6 md:px-12 gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-bold text-base">Room Details</span>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Cover Photo */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
          <img
            src={imageUrl}
            alt={listing.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-md ${
              listing.status === "Available"
                ? "bg-emerald-500 text-white"
                : "bg-zinc-500 text-white"
            }`}>
              {listing.status}
            </span>
          </div>
        </div>

        {/* Title, Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {listing.title}
              </h1>
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-sm">
                <MapPin className="h-4.5 w-4.5 text-zinc-400" />
                <span>{listing.address} ({listing.location})</span>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800/80">
              <div className="text-center p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                <BedDouble className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Room Type</p>
                <p className="text-sm font-bold">{listing.roomType}</p>
              </div>

              <div className="text-center p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                <ShieldCheck className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Furnishing</p>
                <p className="text-sm font-bold">{listing.furnishing}</p>
              </div>

              <div className="text-center p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                <Users className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Gender Pref</p>
                <p className="text-sm font-bold">{listing.genderPreference || "Any"}</p>
              </div>

              <div className="text-center p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                <Calendar className="h-5 w-5 mx-auto text-zinc-400 mb-1" />
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">Available From</p>
                <p className="text-xs font-bold truncate mt-0.5">{availableDate}</p>
              </div>
            </div>

            {/* AI Compatibility Panel */}
            {isTenant && (
              <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/10 dark:to-blue-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-bold text-base">AI Compatibility Analysis</h3>
                  </div>
                  {isCompLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                  ) : (
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {compatibility?.score}%
                    </span>
                  )}
                </div>

                {isCompLoading ? (
                  <p className="text-xs text-zinc-500">Calculating your roommate compatibility score...</p>
                ) : compatibility ? (
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${compatibility.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-zinc-655 dark:text-zinc-350 leading-relaxed">
                      {compatibility.explanation}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-red-500">
                    Unable to fetch score. Please ensure you have configured your Tenant Profile match criteria.
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">About this room</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((amenity: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Contact Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Rent Card */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-semibold">Monthly Rent</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">${listing.rent}</span>
                  <span className="text-zinc-500 text-sm">/ month</span>
                </div>
              </div>
              
              {listing.securityDeposit !== undefined && (
                <div className="flex justify-between text-sm py-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-zinc-500">Security Deposit</span>
                  <span className="font-semibold">${listing.securityDeposit}</span>
                </div>
              )}

              {/* Express Interest Action for Tenants */}
              {isTenant && listing.status === "Available" && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  {existingRequest ? (
                    <div className="space-y-2 text-center">
                      <button
                        disabled
                        className="w-full py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded-xl text-xs font-semibold"
                      >
                        Application Sent
                      </button>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                        existingRequest.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : existingRequest.status === "Rejected"
                          ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}>
                        Status: {existingRequest.status}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowInterestModal(true)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Express Interest</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Owner Details Card */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-zinc-500 uppercase tracking-wider">Posted by</h3>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{listing.owner?.name || "Property Owner"}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Verified Lister</p>
                </div>
              </div>

              {listing.owner?.email && (
                <a
                  href={`mailto:${listing.owner.email}?subject=Inquiry about ${encodeURIComponent(listing.title)}`}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Owner</span>
                </a>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Express Interest Dialog Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Express Interest</h3>
            <p className="text-xs text-zinc-500">
              Send a friendly introduction message to the property lister. They will review your profile preferences and compatibility.
            </p>
            
            <form onSubmit={handleInterestSubmit} className="space-y-4">
              <textarea
                rows={4}
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                required
              />

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterestModal(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expressInterestMutation.isPending}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  {expressInterestMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
