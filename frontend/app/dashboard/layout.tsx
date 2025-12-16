"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PasswordChangeModal } from "@/components/PasswordChangeModal";
import { DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  //const { isAuthenticated } = useAccesoStore();
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <style jsx global>{`
        body {
          font-family: ${dmSans.style.fontFamily};
        }
      `}</style>
      <div className="flex h-screen w-full">
        <SidebarProvider>
          <AppSidebar className="shrink-0" />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b px-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Página Actual</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex-1" />
              <SiteHeader />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
          </div>
        </SidebarProvider>

        {/* Modal de cambio de contraseña */}
        <PasswordChangeModal
          open={showPasswordChangeModal}
          onClose={() => setShowPasswordChangeModal(false)}
        />
      </div>
    </ThemeProvider>
  );
}
