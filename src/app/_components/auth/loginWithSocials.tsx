"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const LogInWithSocials = () => {
  return (
    <>
      <Button
        onClick={() => signIn("google")}
        variant="outline"
        className="w-full"
      >
        Login with Google
      </Button>
    </>
  );
};

export default LogInWithSocials;
