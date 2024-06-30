"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
const SignInWithGoogleButton = () => {
  return (
    <Button onClick={() => signIn("google")}>Get Started using Google</Button>
  );
};

export default SignInWithGoogleButton;
