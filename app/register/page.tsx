"use client";

import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[100dvh] bg-hs-main-bg">
      <RegisterForm />
    </div>
  );
}
