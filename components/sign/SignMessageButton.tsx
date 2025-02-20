"use client";
import { useSigner } from "@account-kit/react";
import { useChallenge } from "@/contexts/ChallengeContext";
import { useSmartAccount } from "@/contexts/SmartAccountContext";

// gonna hardcode this until we configure this somewhere
const SALT = "0";

interface SignMessageButtonProps {
  challenge: string;
  onRedirectStart: (success?: boolean) => void;
}

export function SignMessageButton({
  challenge,
  onRedirectStart,
}: SignMessageButtonProps) {
  const { address } = useSmartAccount();
  const { redirect } = useChallenge();
  const signer = useSigner();

  async function handleSignMessage() {
    try {
      onRedirectStart();
      const signature = await signer?.signMessage(challenge);

      // Construct redirect URL with signature
      const redirectUrl = new URL(redirect);
      redirectUrl.searchParams.append("signature", signature || "");
      redirectUrl.searchParams.append("sca", address || "");
      redirectUrl.searchParams.append("salt", SALT);

      // Wait for a second to show the intermediate state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the destination
      window.location.href = redirectUrl.toString();
    } catch (error) {
      console.error("Failed to sign message:", error);
      onRedirectStart(false);
    }
  }

  return (
    <button
      onClick={handleSignMessage}
      className={`
        w-full bg-blue-600 text-white py-3 px-6 rounded-md
        hover:bg-blue-700 transition-colors duration-200
        flex items-center justify-center space-x-2
      `}
    >
      <span>Verify with signature</span>
    </button>
  );
}
