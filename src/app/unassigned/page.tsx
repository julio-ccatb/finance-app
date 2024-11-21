"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ROUTES } from "../_components/utils/routes";

export default function Component() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertCircle className="h-6 w-6" />
            No Assigned Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            {`Your account has been created successfully, but you haven't been
            assigned any roles yet.`}
          </p>
          <p className="text-muted-foreground">
            {`Please contact your system administrator to have your account roles
            configured. Once your roles are set up, you'll be able to access the
            appropriate areas of the application.`}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {"Log Out"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
