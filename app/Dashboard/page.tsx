
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Leaf, House, ChartNoAxesColumn, SlidersHorizontal,
  Settings, Power, Wind, Sun, Droplets, Zap,
  Thermometer, PlugZap, Bell, CircleUserRound,
  TrendingDown, ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [acOn, setAcOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [temperature, setTemperature] = useState(24);
  
const [user, setUser] = useState<{
  name: string;
  email: string;
} | null>(null);

const [authLoading, setAuthLoading] = useState(true);
const [authError, setAuthError] = useState("");

useEffect(() => {
  let isMounted = true;

  const verifyUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.replace("/Login");
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success || !data.user) {
        throw new Error(data.message || "Unable to verify user");
      }

      if (isMounted) {
        setUser(data.user);
      }

    } catch (error) {
      if (isMounted) {
        setAuthError(
          error instanceof Error
            ? error.message
            : "Unable to connect to authentication server"
        );
      }
    } finally {
      if (isMounted) {
        setAuthLoading(false);
      }
    }
  };

  verifyUser();

  return () => {
    isMounted = false;
  };
}, []);


  const tabs = [
    { name: "Overview", icon: House },
    { name: "Analytics", icon: ChartNoAxesColumn },
    { name: "Control", icon: SlidersHorizontal },
    { name: "Savings", icon: TrendingDown },
    { name: "Settings", icon: Settings },
  ];
  
if (authLoading) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="font-semibold text-[#061A3A]">
        Verifying your login session...
      </p>
    </main>
  );
}

if (authError || !user) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold text-[#061A3A]">
          Unable to load Dashboard
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          {authError || "Please sign in to continue."}
        </p>

        <Link
          href="/Login"
          className="mt-5 inline-block rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Go to Sign In
        </Link>
      </section>
    </main>
  );
}


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 bg-[#061A3A] px-4 py-4 text-white shadow-lg sm:px-7">

        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <Leaf size={23} />
          </span>
          <span>
            <span className="block text-lg font-bold">Smart AC</span>
            <span className="hidden text-xs text-slate-300 sm:block">
              Energy-aware comfort
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                activeTab === name
                  ? "bg-white/15 font-bold text-cyan-300"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              <Icon size={17} />
              {name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Bell size={20} />
          <CircleUserRound size={25} />
          <Link href="/Login" className="text-sm text-cyan-200 hover:underline">
            Sign out
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 p-4 pb-28 sm:p-7">

        {/* Welcome */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              Your personal energy dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#061A3A] sm:text-3xl">
             Welcome back, {user.name}!
            
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor your comfort, AC performance and energy consumption.
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700">
            Demo data
          </span>
        </section>

        {/* Device Connection */}
        <section className="rounded-3xl bg-[#061A3A] p-5 text-white shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <PlugZap size={28} className="text-cyan-300" />
              </div>
              <div>
                <h2 className="font-bold">Your AC Device</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {connected ? "Demo device connected" : "No device connected"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setConnected(!connected)}
              className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
            >
              {connected ? "Disconnect Device" : "Connect Your AC"}
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-300">
            {connected
              ? "Demo connection only. Real hardware integration is not active yet."
              : "Connect a compatible AC monitoring device to begin personal monitoring."}
          </p>
        </section>

        {/* AC Status */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-4 ${
                acOn ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
              }`}>
                <Power size={27} />
              </div>
              <div>
                <h2 className="font-bold">AC is {acOn ? "ON" : "OFF"}</h2>
                <p className="text-sm text-slate-500">
                  {acOn ? "Cooling mode" : "Standby mode"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setAcOn(!acOn)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                acOn ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {acOn ? "Turn AC Off" : "Turn AC On"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-50 p-5">
              <div className="flex items-center gap-2 text-sky-700">
                <Thermometer size={20} />
                <p className="text-sm font-medium">AC Temperature</p>
              </div>
              <p className="mt-3 text-4xl font-bold">{temperature}°C</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setTemperature(Math.max(16, temperature - 1))}
                  className="rounded-lg border border-sky-200 px-4 py-2 font-bold"
                >
                  −
                </button>
                <button
                  onClick={() => setTemperature(Math.min(30, temperature + 1))}
                  className="rounded-lg border border-sky-200 px-4 py-2 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-slate-600">
                <Wind size={20} />
                <p className="text-sm font-medium">Room Temperature</p>
              </div>
              <p className="mt-3 text-4xl font-bold">26.5°C</p>
              <p className="mt-3 text-xs text-slate-500">Sample sensor reading</p>
            </div>
          </div>
        </section>

        {/* Environment */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <Sun className="text-amber-500" size={23} />
            <p className="mt-3 text-sm text-slate-500">Outdoor</p>
            <p className="mt-1 text-2xl font-bold">34°C</p>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <Droplets className="text-sky-500" size={23} />
            <p className="mt-3 text-sm text-slate-500">Humidity</p>
            <p className="mt-1 text-2xl font-bold">58%</p>
          </div>

          <div className="col-span-2 rounded-2xl border bg-white p-4 shadow-sm sm:col-span-1">
            <Wind className="text-emerald-600" size={23} />
            <p className="mt-3 text-sm text-slate-500">Occupancy</p>
            <p className="mt-1 text-2xl font-bold">2 People</p>
          </div>
        </section>

        {/* Energy Usage */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Zap size={22} className="text-sky-600" />
              <h2 className="font-bold">Today's Energy Usage</h2>
            </div>
            <p className="mt-5 text-4xl font-bold">3.2 kWh</p>
            <p className="mt-2 text-lg text-slate-500">≈ ₹25.60</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              ↓ 18% vs last week
            </span>
            <p className="mt-3 text-xs text-slate-400">
              Sample figures, not live meter data.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold">Monthly Energy Budget</h2>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-bold">72 / 100</p>
              <p className="text-sm font-semibold text-emerald-600">72% used</p>
            </div>
            <p className="text-sm text-slate-500">kWh consumed</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[72%] rounded-full bg-emerald-500" />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Sample monthly budget.
            </p>
          </div>
        </section>

        {/* AI Recommendation */}
        <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Leaf size={22} className="text-emerald-600" />
            <h2 className="font-bold text-[#061A3A]">
              AI Energy Recommendation
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Try setting your AC to 25°C to balance cooling comfort and energy consumption.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Example recommendation only. AI control is not connected yet.
          </p>
          <button
            onClick={() => setActiveTab("Control")}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-cyan-700"
          >
            Explore AI Control <ChevronRight size={17} />
          </button>
        </section>

        {/* Section Preview */}
        {activeTab !== "Overview" && (
          <section className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <h2 className="font-bold text-[#061A3A]">{activeTab}</h2>
            <p className="mt-2 text-sm text-slate-600">
              This section will be developed as a full feature in the next stage.
            </p>
          </section>
        )}

      </div>

      {/* Mobile Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur lg:hidden">
        {tabs.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] ${
              activeTab === name
                ? "bg-sky-50 font-bold text-sky-700"
                : "text-slate-500"
            }`}
          >
            <Icon size={20} />
            {name}
          </button>
        ))}
      </nav>

    </main>
  );
}
