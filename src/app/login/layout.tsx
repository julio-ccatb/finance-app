"use client";
import { SessionProvider } from "next-auth/react";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <SessionProvider>{children}</SessionProvider>
);

export default Layout;
