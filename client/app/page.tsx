"use client";

import React from "react";
import Link from "next/link";
import { Building, Users, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-50">
          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Flatmate Finder</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Find the perfect roommate or shared rental space.
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            A simple, secure platform to list your spare rooms, manage your properties, or browse compatible flatmates in your preferred locations.
          </p>
        </div>

        {/* Portal Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
          {/* Option 1: Owner */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-shadow shadow-sm hover:shadow text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">I am a Property Owner</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                List your vacant rooms, specify occupancy, room details, and manage everything inside a clean dashboard.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>List Property</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Option 2: Tenant */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-shadow shadow-sm hover:shadow text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-md bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">I am looking for Flatmates</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Browse listed rooms, filter by location, rent budget, room type, and find tenants matching your criteria.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Find Spaces</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="flex gap-3 items-start">
            <div className="h-8 w-8 shrink-0 rounded-md bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">Verified Listings</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Every room posting is managed by verified property owners.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="h-8 w-8 shrink-0 rounded-md bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">Roommate Matching</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Filter flatmates based on budget, lifestyle, location, and habits.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
