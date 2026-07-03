"use client";

import React from "react";
import Link from "next/link";
import { Edit3, Trash2, CheckCircle2, MapPin, DollarSign, BedDouble, ShieldCheck } from "lucide-react";

interface Photo {
  url: string;
  public_id: string;
}

interface Listing {
  _id: string;
  title: string;
  location: string;
  rent: number;
  securityDeposit?: number;
  roomType: string;
  furnishing: string;
  status: string;
  photos?: Photo[];
}

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
  onMarkFilled: (id: string) => void;
}

export default function ListingCard({ listing, onDelete, onMarkFilled }: ListingCardProps) {
  const imageUrl = listing.photos && listing.photos.length > 0 
    ? listing.photos[0].url 
    : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group h-full">
      {/* Property Image / Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
            listing.status === "Available"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-500 text-white"
          }`}>
            {listing.status}
          </span>
        </div>
      </div>

      {/* Info Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-50 line-clamp-1">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              <span>{listing.roomType} Room</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{listing.furnishing}</span>
            </div>
          </div>

          <div className="pt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${listing.rent}</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">/ month</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <Link
            href={`/owner/edit-listing/${listing._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 rounded-xl transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>

          {listing.status === "Available" && (
            <button
              onClick={() => onMarkFilled(listing._id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-xl transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Fill</span>
            </button>
          )}

          <button
            onClick={() => onDelete(listing._id)}
            className="flex items-center justify-center h-8.5 w-8.5 rounded-xl border border-red-100 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-all"
            title="Delete listing"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
