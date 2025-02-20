"use client";
import { useSignerStatus } from "@account-kit/react";
import { Home } from "@/components/sign/Home";
import { Login } from "@/components/login/Login";

export default function ConnectPage() {
  const { isAuthenticating, isInitializing, isConnected } = useSignerStatus();
  const isLoading = isAuthenticating || isInitializing;

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center p-24 gap-4 justify-center text-center">
      {isLoading ? <>Loading...</> : isConnected ? <Home /> : <Login />}
    </main>
  );
}
