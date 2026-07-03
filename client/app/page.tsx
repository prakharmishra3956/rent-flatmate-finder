"use client";

import React from "react";
import Link from "next/link";
import { Building, Users, ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
          <Building className="h-6 w-6" />
          <span>Flatmate Finder</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold ring-1 ring-blue-600/10 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>New: Find flatmates using compatibility metrics</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-3xl leading-[1.15]">
            Find the perfect <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Flatmate</span> or <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Rental Space</span>
          </h1>
          <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            List your spare rooms, manage your properties, or browse highly compatible flatmates in your preferred locations.
          </p>
        </div>

        {/* Portal Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl pt-6">
          {/* Option 1: Owner */}
          <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">I am a Property Owner</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                List your vacant rooms, specify occupancy, room details, and manage everything inside a professional property dashboard.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all"
            >
              <span>List Property</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Option 2: Tenant */}
          <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">I am looking for Flatmates</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Browse listed rooms, filter by location, rent budget, room type, and find tenants or roommates matching your preferences.
              </p>
            </div>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all"
            >
              <span>Find Spaces</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="flex gap-4 p-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Verified Listings</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Every room posting is managed by verified property owners.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Roommate Matching</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Filter flatmates based on lifestyle, gender preference, and habits.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Interactive UI</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Beautiful, fluid interfaces designed for the best listing experience.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
