
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Leaf,
  Power,
  Wind,
  Sun,
  Droplets,
  Users,
  Zap,
  House,
  ChartNoAxesColumn,
  SlidersHorizontal,
  Settings,
} from "lucide-react";

export default function HomeDashboard() {
  const [acOn, setAcOn] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: House },
    { name: "Analytics", icon: ChartNoAxesColumn },
    { name: "Control", icon: SlidersHorizontal },
    { name: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="min-h-screen w-full">

        {/* Header */}
        <header className="relative flex w-full flex-wrap items-center justify-between gap-3 bg-[#061A3A] px-3 py-4 text-white sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">
              <Leaf size={23} />
            </span>

            <span>
              <span className="block text-lg font-bold">Smart AC</span>
              <span className="hidden text-xs text-slate-300 sm:block">
                Save Energy · Save Money · Stay Comfortable
              </span>
            </span>
          </Link>

          {/* Desktop navigation: centered in header */}
          <nav className="hidden items-center justify-center gap-1 xl:absolute xl:left-1/2 xl:flex xl:-translate-x-1/2">
            {tabs.map(({ name, icon: Icon }) => (
              <button
                type="button"
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  activeTab === name
                    ? "bg-white/15 font-bold text-cyan-300"
                    : "text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </nav>

          {/* Sign In / Sign Up */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Link
              href="/Login"
              className="rounded-lg border border-cyan-300 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10"
            >
              Sign In
            </Link>

            <Link
              href="/Signup"
              className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Dashboard content */}
        <section className="w-full space-y-5 p-3 pb-28 sm:p-6 sm:pb-28 lg:p-8 lg:pb-28">

          {/* Welcome */}
          <div>
            <p className="text-sm text-slate-500">
              Welcome to your smart home
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Your AC at a glance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor comfort, energy and savings in one place.
            </p>
          </div>

          {/* AC status */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-4 ${
                    acOn
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Power size={28} />
                </div>

                <div>
                  <h2 className="font-bold">
                    AC is {acOn ? "ON" : "OFF"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {acOn ? "Cooling Mode" : "Standby Mode"}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Demo Mode
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-4 sm:p-5">
              <div>
                <p className="text-sm text-slate-600">AC Temperature</p>
                <p className="mt-1 text-3xl font-bold sm:text-4xl">24°C</p>
                <p className="mt-2 text-xs text-slate-500">
                  Sample reading
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Room Temperature</p>
                <p className="mt-1 text-2xl font-bold">26.5°C</p>

                <div className="mt-2 flex justify-end text-sky-600">
                  <Wind size={22} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Sun size={18} className="text-amber-500" />
                Outdoor: 34°C
              </p>

              <button
                type="button"
                onClick={() => setAcOn(!acOn)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                  acOn
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {acOn ? "Turn AC Off" : "Turn AC On"}
              </button>
            </div>
          </section>

          {/* Environment */}
          <section className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <Sun className="text-amber-500" size={22} />
              <p className="mt-3 text-xs text-slate-500">Outdoor</p>
              <p className="mt-1 text-lg font-bold sm:text-2xl">34°C</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <Droplets className="text-sky-500" size={22} />
              <p className="mt-3 text-xs text-slate-500">Humidity</p>
              <p className="mt-1 text-lg font-bold sm:text-2xl">58%</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <Users className="text-emerald-600" size={22} />
              <p className="mt-3 text-xs text-slate-500">Occupancy</p>
              <p className="mt-1 text-lg font-bold sm:text-2xl">2</p>
            </div>
          </section>

          {/* Energy usage */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-2">
              <Zap size={22} className="text-sky-600" />
              <h2 className="font-bold">Today's Energy Usage</h2>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Zap size={35} className="text-slate-700" />

              <div>
                <p className="text-3xl font-bold">3.2 kWh</p>
                <p className="mt-1 text-lg font-medium text-slate-500">
                  ≈ ₹25.60
                </p>
              </div>
            </div>

            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              ↓ 18% vs. last week
            </span>

            <p className="mt-3 text-xs text-slate-400">
              Sample figures, not live meter data.
            </p>
          </section>

          {/* Monthly budget */}
          <section className="rounded-3xl bg-[#061A3A] p-5 text-white sm:p-7">
            <h2 className="font-bold">Monthly Energy Budget</h2>

            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold">
                72 / 100 <span className="text-sm">kWh</span>
              </p>

              <p className="text-sm font-semibold text-emerald-300">
                72% used
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[72%] rounded-full bg-emerald-400" />
            </div>

            <p className="mt-3 text-sm text-slate-300">
              Demo data — connect your energy model for live predictions.
            </p>
          </section>

          {/* Selected section preview */}
          {activeTab !== "Home" && (
            <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
              <h2 className="font-semibold">{activeTab}</h2>
              <p className="mt-1">
                This section is a preview. Its full page can be connected next.
              </p>
            </section>
          )}
        </section>

        {/* Footer */}
        <footer className="px-4 pb-24 text-center text-xs text-slate-400 lg:pb-6">
          Smart AC · Energy-aware comfort
        </footer>

        {/* Mobile navigation: fixed at bottom */}
        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-slate-200 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              type="button"
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-xs transition ${
                activeTab === name
                  ? "bg-sky-50 font-bold text-sky-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={21} />
              {name}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
