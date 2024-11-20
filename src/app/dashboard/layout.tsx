import "@/styles/globals.css";

import { type Metadata } from "next";

import SidebarLayout from "@/components/sidebar/sidebar";
import { auth } from "@/server/auth";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  if (session?.user) {
    return (
      <SidebarProvider defaultOpen={defaultOpen}>
        <SidebarLayout
          user={{
            avatar: session.user.image!,
            name: session.user.name!,
            email: session.user.email!,
          }}
        >
          {children}
          <Toaster />
        </SidebarLayout>
      </SidebarProvider>
    );
  }
}
