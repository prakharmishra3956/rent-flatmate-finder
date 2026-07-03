"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Sidebar from "../../../components/Owner/Sidebar";
import ListingForm from "../../../components/Owner/ListingForm";
import { createListing } from "../../../services/listingService";
import { getCurrentUser } from "../../../services/authService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddListingPage() {
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

  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      toast.success("Listing created successfully!");
      router.push("/owner/my-listings");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create listing";
      toast.error(msg);
    },
  });

  const handleSubmit = (formData: any) => {
    createMutation.mutate(formData);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Publish your space to start receiving room/flatmate matches
          </p>
        </div>

        {/* Form Container */}
        <div>
          <ListingForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitButtonText="Publish Listing"
          />
        </div>
      </main>
    </div>
  );
}
