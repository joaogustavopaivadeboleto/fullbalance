// src/app/(main)/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import FullscreenLoader from "@/components/ui/FullscreenLoader";
import MobileHeader from "@/components/layout/MobileHeader";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="fullscreen-loader">
        <p>Carregando FullBalance...</p>
      </div>
    );
  }
  if (loading) {
    return <FullscreenLoader />;
  }
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-wrapper">
        <MobileHeader />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
