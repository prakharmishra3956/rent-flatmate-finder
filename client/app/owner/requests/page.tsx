"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "../../../components/Owner/Sidebar";
import ChatWindow from "../../../components/Chat/ChatWindow";
import { getReceivedInterests, updateInterestStatus } from "../../../services/ownerService";
import { getCurrentUser } from "../../../services/authService";
import { 
  Loader2, 
  User, 
  Mail, 
  Building, 
  Check, 
  X, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function OwnerRequestsPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);

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

  // Fetch Received requests
  const { data: interests, isLoading, refetch } = useQuery({
    queryKey: ["receivedInterests"],
    queryFn: getReceivedInterests,
    enabled: !isCheckingAuth,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ interestId, status }: { interestId: string; status: "Accepted" | "Rejected" }) => 
      updateInterestStatus(interestId, status),
    onSuccess: (data, variables) => {
      toast.success(`Request ${variables.status.toLowerCase()} successfully!`);
      refetch();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update request status";
      toast.error(msg);
    },
  });

  const handleUpdateStatus = (interestId: string, status: "Accepted" | "Rejected") => {
    updateStatusMutation.mutate({ interestId, status });
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen relative flex">
        <div className="flex-1 space-y-8 pr-4">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Match Requests</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Review and respond to roommate applications for your listed spaces
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
                    {/* Top Row: Listing & Tenant details */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                          <Building className="h-3.5 w-3.5" />
                          <span>Listing: {interest.listing?.title}</span>
                        </div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <User className="h-5 w-5 text-zinc-400" />
                          <span>{interest.tenant?.name}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{interest.tenant?.email}</span>
                        </div>
                      </div>

                      {/* Status Badge / Action Button */}
                      <div>
                        {interest.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(interest._id, "Accepted")}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(interest._id, "Rejected")}
                              className="px-4 py-2 border border-red-200 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-600 dark:text-red-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              interest.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                            }`}>
                              {interest.status === "Accepted" ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              <span>{interest.status}</span>
                            </span>

                            {interest.status === "Accepted" && (
                              <button
                                onClick={() => setActiveChat({
                                  listingId: interest.listing?._id,
                                  tenantId: interest.tenant?._id,
                                  recipientId: interest.tenant?._id,
                                  recipientName: interest.tenant?.name,
                                })}
                                className="px-4 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>Chat</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Message */}
                    {interest.message && (
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-xl text-sm italic text-zinc-650 dark:text-zinc-350">
                        "{interest.message}"
                      </div>
                    )}

                    {/* Bottom Row: AI Compatibility scorecard */}
                    {comp ? (
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
                    ) : (
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-center gap-2 text-xs text-zinc-500">
                        <HelpCircle className="h-4 w-4" />
                        <span>AI Compatibility analysis is unavailable (No tenant profile).</span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-4xl">
              <MessageSquare className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">No requests received</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                When tenants apply to your active rooms, they will show up here.
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
