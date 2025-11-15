// src/app/(main)/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import FullscreenLoader from "@/components/ui/FullscreenLoader";
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
      <main className="main-content">{children}</main>
    </div>
  );
}
