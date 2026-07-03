"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface TenantProfileFormValues {
  preferredLocation: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  preferredRoomType: "Single" | "Double" | "Shared";
  preferredAmenities: string; // comma-separated
}

interface TenantProfileFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitButtonText?: string;
}

export default function TenantProfileForm({
  initialValues,
  onSubmit,
  isLoading,
  submitButtonText = "Save Preferences",
}: TenantProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TenantProfileFormValues>({
    defaultValues: {
      preferredRoomType: "Single",
      budgetMin: 0,
      budgetMax: 0,
    },
  });

  // Pre-fill initial values if profile already exists
  useEffect(() => {
    if (initialValues) {
      setValue("preferredLocation", initialValues.preferredLocation || "");
      setValue("budgetMin", initialValues.budgetMin || 0);
      setValue("budgetMax", initialValues.budgetMax || 0);
      setValue("preferredRoomType", initialValues.preferredRoomType || "Single");

      if (initialValues.moveInDate) {
        const date = new Date(initialValues.moveInDate);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        setValue("moveInDate", `${yyyy}-${mm}-${dd}`);
      }

      if (initialValues.preferredAmenities && Array.isArray(initialValues.preferredAmenities)) {
        setValue("preferredAmenities", initialValues.preferredAmenities.join(", "));
      }
    }
  }, [initialValues, setValue]);

  const handleFormSubmit = (values: TenantProfileFormValues) => {
    const amenitiesArray = values.preferredAmenities
      ? values.preferredAmenities.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const formattedData = {
      ...values,
      budgetMin: Number(values.budgetMin),
      budgetMax: Number(values.budgetMax),
      preferredAmenities: amenitiesArray,
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Preferred Location */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Preferred Location</label>
          <input
            type="text"
            placeholder="e.g. Downtown, Brooklyn, Queens"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("preferredLocation", { required: "Location is required" })}
          />
          {errors.preferredLocation && <p className="text-red-500 text-xs mt-1">{errors.preferredLocation.message}</p>}
        </div>

        {/* Budget Min */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Min Budget ($)</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("budgetMin", { 
              required: "Min budget is required",
              valueAsNumber: true,
              validate: val => val >= 0 || "Budget cannot be negative"
            })}
          />
          {errors.budgetMin && <p className="text-red-500 text-xs mt-1">{errors.budgetMin.message}</p>}
        </div>

        {/* Budget Max */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Max Budget ($)</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("budgetMax", { 
              required: "Max budget is required",
              valueAsNumber: true,
              validate: val => val >= 0 || "Budget cannot be negative"
            })}
          />
          {errors.budgetMax && <p className="text-red-500 text-xs mt-1">{errors.budgetMax.message}</p>}
        </div>

        {/* Move-In Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Target Move-In Date</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("moveInDate", { required: "Move-in date is required" })}
          />
          {errors.moveInDate && <p className="text-red-500 text-xs mt-1">{errors.moveInDate.message}</p>}
        </div>

        {/* Room Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Preferred Room Type</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("preferredRoomType")}
          >
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Shared">Shared Room</option>
          </select>
        </div>

        {/* Preferred Amenities */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Preferred Amenities (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. WiFi, AC, Gym, Private Bath, Kitchen"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            {...register("preferredAmenities")}
          />
        </div>

      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{submitButtonText}</span>
        </button>
      </div>
    </form>
  );
}
