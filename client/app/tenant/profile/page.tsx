"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import TenantSidebar from "../../../components/Tenant/TenantSidebar";
import TenantProfileForm from "../../../components/Tenant/TenantProfileForm";
import { getTenantProfile, createTenantProfile, updateTenantProfile } from "../../../services/tenantService";
import { getCurrentUser } from "../../../services/authService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TenantProfilePage() {
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

  // Fetch current profile preferences
  const { data: profile, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ["tenantProfile"],
    queryFn: getTenantProfile,
    enabled: !isCheckingAuth,
  });

  const mutation = useMutation({
    mutationFn: (formData: any) => {
      if (profile) {
        return updateTenantProfile(formData);
      } else {
        return createTenantProfile(formData);
      }
    },
    onSuccess: () => {
      toast.success(profile ? "Preferences updated!" : "Preferences saved!");
      refetch();
      router.push("/tenant/dashboard");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to save preferences";
      toast.error(msg);
    },
  });

  const handleSubmit = (formData: any) => {
    mutation.mutate(formData);
  };

  if (isCheckingAuth || isProfileLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <TenantSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Match Preferences</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tell us about your budget, target move-in date, and preferred flat details
          </p>
        </div>

        {/* Form Container */}
        <div>
          <TenantProfileForm
            initialValues={profile}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            submitButtonText={profile ? "Update Preferences" : "Save Preferences"}
          />
        </div>
      </main>
    </div>
  );
}
