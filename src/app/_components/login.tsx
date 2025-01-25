"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
const SignInWithGoogleButton = () => {
  return (
    <Button onClick={() => signIn("google")} className="mt-6">
      Get Started with Google
    </Button>
  );
};

export default SignInWithGoogleButton;
