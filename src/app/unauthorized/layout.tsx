import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "No Autorizado - ColorUnit",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <>{children}</>
);

export default Layout;
