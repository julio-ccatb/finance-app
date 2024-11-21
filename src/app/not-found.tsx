/**
 * v0 by Vercel.
 * @see https://v0.dev/t/yWYpaHrdyyX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "./_components/utils/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404 Page Not Found
          </h1>
          <p className="pb-4 text-gray-500">
            Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
          </p>
        </div>
        <Link href={ROUTES.HOME} className="w-full" prefetch={false}>
          <Button>Return to website</Button>
        </Link>
      </div>
    </div>
  );
}
