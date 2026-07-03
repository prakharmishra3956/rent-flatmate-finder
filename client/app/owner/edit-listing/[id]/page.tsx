"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "../../../../components/Owner/Sidebar";
import ListingForm from "../../../../components/Owner/ListingForm";
import { getListing, updateListing } from "../../../../services/listingService";
import { getCurrentUser } from "../../../../services/authService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const router = useRouter();
  const { id } = use(params);
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

  // Fetch listing details
  const { data: listing, isLoading: isFetchLoading } = useQuery({
    queryKey: ["editListing", id],
    queryFn: () => getListing(id),
    enabled: !isCheckingAuth && !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (formData: any) => updateListing(id, formData),
    onSuccess: () => {
      toast.success("Listing updated successfully!");
      router.push("/owner/my-listings");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update listing";
      toast.error(msg);
    },
  });

  const handleSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  if (isCheckingAuth || isFetchLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading property details...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Property Listing</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Update your property's details, photos, rent, or availability status
          </p>
        </div>

        {/* Form Container */}
        <div>
          <ListingForm
            initialValues={listing}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            submitButtonText="Update Listing"
          />
        </div>
      </main>
    </div>
  );
}
