import { redirect } from "next/navigation";
import { ROUTES } from "./_components/utils/routes";

export default async function Home() {
  redirect(ROUTES.LOGIN);
}
