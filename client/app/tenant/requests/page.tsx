"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import TenantSidebar from "../../../components/Tenant/TenantSidebar";
import ChatWindow from "../../../components/Chat/ChatWindow";
import { getSentInterests } from "../../../services/tenantService";
import { getCurrentUser } from "../../../services/authService";
import { 
  Loader2, 
  Building, 
  User, 
  Mail, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

export default function TenantRequestsPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);

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

  // Fetch Sent requests
  const { data: interests, isLoading } = useQuery({
    queryKey: ["sentInterests"],
    queryFn: getSentInterests,
    enabled: !isCheckingAuth,
  });

  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TenantSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen relative flex">
        <div className="flex-1 space-y-8 pr-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Track the status of room match requests you have sent to landlords
            </p>
          </div>

          {/* Requests List */}
          {interests && interests.length > 0 ? (
            <div className="space-y-6 max-w-4xl">
              {interests.map((interest: any) => {
                const comp = interest.compatibility;
                return (
                  <div 
                    key={interest._id}
                    className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-6"
                  >
                    {/* Top Row: Listing & Owner details */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                          <Building className="h-3.5 w-3.5" />
                          <span>Listing: {interest.listing?.title}</span>
                        </div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <User className="h-5 w-5 text-zinc-400" />
                          <span>Owner: {interest.owner?.name}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{interest.owner?.email}</span>
                        </div>
                      </div>

                      {/* Status / Chat */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          interest.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : interest.status === "Rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          {interest.status === "Accepted" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : interest.status === "Rejected" ? (
                            <XCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          <span>{interest.status}</span>
                        </span>

                        {interest.status === "Accepted" && (
                          <button
                            onClick={() => setActiveChat({
                              listingId: interest.listing?._id,
                              tenantId: interest.tenant, // logged-in tenant
                              recipientId: interest.owner?._id,
                              recipientName: interest.owner?.name,
                            })}
                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Chat</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Message */}
                    {interest.message && (
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl text-sm italic text-zinc-650 dark:text-zinc-355">
                        "{interest.message}"
                      </div>
                    )}

                    {/* Bottom Row: AI Compatibility scorecard */}
                    {comp && (
                      <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/10 dark:to-blue-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                            <Sparkles className="h-4.5 w-4.5" />
                            <h4 className="font-bold text-xs">Roommate AI Fit</h4>
                          </div>
                          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{comp.score}% Match</span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {comp.explanation}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-4xl">
              <MessageSquare className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">No applications sent</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Browse listed rooms and click "Express Interest" to apply.
              </p>
            </div>
          )}
        </div>

        {/* Floating Chat Drawer */}
        {activeChat && (
          <div className="hidden md:block fixed bottom-4 right-4 z-50">
            <ChatWindow
              listingId={activeChat.listingId}
              tenantId={activeChat.tenantId}
              recipientId={activeChat.recipientId}
              recipientName={activeChat.recipientName}
              onClose={() => setActiveChat(null)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
