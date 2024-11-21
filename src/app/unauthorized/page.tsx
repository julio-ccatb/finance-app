"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "../_components/utils/routes";

export default function Component() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {`Sorry, you don't have permission to access this page. If you believe
            this is an error, please contact your administrator.`}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push(ROUTES.HOME)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
