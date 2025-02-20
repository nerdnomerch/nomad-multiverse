"use client";
import { useAuthModal } from "@account-kit/react";
import { useChallenge } from "@/contexts/ChallengeContext";
import { LockIcon } from "./icons/LockIcon";
import { LoginButton } from "./LoginButton";

export function Login() {
  const { openAuthModal } = useAuthModal();
  const { redirect } = useChallenge();

  const domain = redirect ? new URL(redirect).hostname : "This site";

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <LockIcon />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sign in to continue
          </h2>
          <p className="text-gray-600 max-w-sm">
            <span className="font-medium text-gray-800">{domain}</span> would
            like you to verify your identity by signing in with your Nomad
            account
          </p>
        </div>

        <LoginButton onClick={openAuthModal} />
      </div>
    </div>
  );
}
