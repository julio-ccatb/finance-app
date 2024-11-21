import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "No asignado - ColorUnit",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <>{children}</>
);

export default Layout;
