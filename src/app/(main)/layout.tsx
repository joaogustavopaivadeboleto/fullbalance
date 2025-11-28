// src/app/(main)/layout.tsx

"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useSidebar } from "@/context/SidebarContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMinimized } = useSidebar();

  return (
    <div className={`main-layout ${isMinimized ? "sidebar-minimized" : ""}`}>
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
