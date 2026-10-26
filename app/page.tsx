
"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./Components/SplashScreen";
import HomeDashboard from "./Components/HomeDasboard";


export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
    return <HomeDashboard />;

 
}

