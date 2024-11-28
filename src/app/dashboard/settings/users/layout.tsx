import { withRolesV2 } from "@/app/_components/auth/withRoles";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajustes - Finance App",
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <>{children}</>
);

export default withRolesV2(Layout, ["ADMIN"]);
