"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

interface ListingFormValues {
  title: string;
  description: string;
  location: string;
  address: string;
  rent: number;
  securityDeposit: number;
  availableFrom: string;
  roomType: "Single" | "Double" | "Shared";
  furnishing: "Furnished" | "Semi Furnished" | "Unfurnished";
  genderPreference: "Male" | "Female" | "Any";
  occupancy: number;
  amenities: string; // comma-separated
  photoUrl?: string;
}

interface ListingFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  submitButtonText?: string;
}

export default function ListingForm({
  initialValues,
  onSubmit,
  isLoading,
  submitButtonText = "Save Listing",
}: ListingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ListingFormValues>({
    defaultValues: {
      roomType: "Single",
      furnishing: "Furnished",
      genderPreference: "Any",
      occupancy: 1,
      rent: 0,
      securityDeposit: 0,
    },
  });

  // Pre-fill initial values if editing
  useEffect(() => {
    if (initialValues) {
      setValue("title", initialValues.title || "");
      setValue("description", initialValues.description || "");
      setValue("location", initialValues.location || "");
      setValue("address", initialValues.address || "");
      setValue("rent", initialValues.rent || 0);
      setValue("securityDeposit", initialValues.securityDeposit || 0);
      setValue("roomType", initialValues.roomType || "Single");
      setValue("furnishing", initialValues.furnishing || "Furnished");
      setValue("genderPreference", initialValues.genderPreference || "Any");
      setValue("occupancy", initialValues.occupancy || 1);
      
      if (initialValues.availableFrom) {
        // Format date to YYYY-MM-DD
        const date = new Date(initialValues.availableFrom);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        setValue("availableFrom", `${yyyy}-${mm}-${dd}`);
      }

      if (initialValues.amenities && Array.isArray(initialValues.amenities)) {
        setValue("amenities", initialValues.amenities.join(", "));
      }

      if (initialValues.photos && initialValues.photos.length > 0) {
        setValue("photoUrl", initialValues.photos[0].url || "");
      }
    }
  }, [initialValues, setValue]);

  const handleFormSubmit = (values: ListingFormValues) => {
    // Format amenities into array
    const amenitiesArray = values.amenities
      ? values.amenities.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    // Format photos
    const photos = values.photoUrl
      ? [{ url: values.photoUrl, public_id: "manual" }]
      : [];

    const formattedData = {
      ...values,
      rent: Number(values.rent),
      securityDeposit: Number(values.securityDeposit),
      occupancy: Number(values.occupancy),
      amenities: amenitiesArray,
      photos,
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Listing Title</label>
          <input
            type="text"
            placeholder="e.g. Spacious Bedroom near Subway Station"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
          <textarea
            rows={4}
            placeholder="Describe the space, your roommates preference, house rules, etc."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Location (City/Area) */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Location (City/Area)</label>
          <input
            type="text"
            placeholder="e.g. Downtown or Brooklyn"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("location", { required: "Location is required" })}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        {/* Full Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Address</label>
          <input
            type="text"
            placeholder="e.g. 123 Maple Street"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        {/* Monthly Rent */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Monthly Rent ($)</label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("rent", { 
              required: "Rent is required",
              valueAsNumber: true,
              validate: val => val > 0 || "Rent must be greater than 0"
            })}
          />
          {errors.rent && <p className="text-red-500 text-xs mt-1">{errors.rent.message}</p>}
        </div>

        {/* Security Deposit */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Security Deposit ($)</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("securityDeposit", { valueAsNumber: true })}
          />
        </div>

        {/* Available From */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Available From</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("availableFrom", { required: "Available date is required" })}
          />
          {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom.message}</p>}
        </div>

        {/* Room Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Room Type</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("roomType")}
          >
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Shared">Shared Room</option>
          </select>
        </div>

        {/* Furnishing */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Furnishing</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("furnishing")}
          >
            <option value="Furnished">Fully Furnished</option>
            <option value="Semi Furnished">Semi Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Gender Preference */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Gender Preference</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("genderPreference")}
          >
            <option value="Any">No Preference</option>
            <option value="Male">Male Only</option>
            <option value="Female">Female Only</option>
          </select>
        </div>

        {/* Max Occupancy */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Max Occupancy</label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("occupancy", { valueAsNumber: true })}
          />
        </div>

        {/* Amenities */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Amenities (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. WiFi, Air Conditioning, Gym, Laundry"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("amenities")}
          />
        </div>

        {/* Photo URL */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Photo URL</label>
          <input
            type="url"
            placeholder="e.g. https://images.unsplash.com/photo-..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            {...register("photoUrl")}
          />
        </div>

      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{submitButtonText}</span>
        </button>
      </div>
    </form>
  );
}
