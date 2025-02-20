"use client";
import { useLogout, useUser } from "@account-kit/react";
import { useSmartAccount } from "@/contexts/SmartAccountContext";
import { useChallenge } from "@/contexts/ChallengeContext";
import { SignMessageButton } from "./SignMessageButton";
import { VerifyIcon } from "./icons/VerifyIcon";
import { useState } from "react";

const truncateEmail = (email: string, maxLength: number = 24) => {
  if (!email || email.length <= maxLength) return email;
  const [localPart, domain] = email.split("@");
  if (!domain) return email;

  const availableLength = maxLength - domain.length - 3; // 3 for '@' and '..'
  if (availableLength < 4) return email; // Too short to truncate meaningfully

  return `${localPart.slice(0, availableLength)}...@${domain}`;
};

export function Home() {
  const { logout } = useLogout();
  const user = useUser();
  const { challenge, redirect } = useChallenge();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const domain = redirect ? new URL(redirect).hostname : "the application";

  const truncatedEmail = truncateEmail(user?.email || "");

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <VerifyIcon />
        </div>

        {isRedirecting ? (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Sending you back to {domain}...</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Verify Account
              </h1>
              <p className="text-gray-600">Welcome, {truncatedEmail}</p>
              <p className="text-gray-600 max-w-sm">
                Click the button below to sign a verification message. Once
                verified, you will be redirected to {domain} to complete your
                session.
              </p>
            </div>

            <div className="w-full space-y-4">
              <SignMessageButton
                challenge={challenge}
                onRedirectStart={() => setIsRedirecting(true)}
              />
              <button
                onClick={() => logout()}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
