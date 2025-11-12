"use client";

import React from "react";

// import client component dynamically (optional) or regular import
// dynamic is useful if you want to disable SSR for this component:
// const RecruiterDashboard = dynamic(() => import("@/components/recruiter/RecruiterDashboard"), { ssr: false });
import RecruiterDashboard from "@/components/RecruiterDashboard";

export default function Page() {
  return <RecruiterDashboard />;
}