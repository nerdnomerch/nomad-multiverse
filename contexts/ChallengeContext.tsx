import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const defaultChallenge = "default-challenge";
const defaultRedirect = "http://example.com";

type ChallengeContextType = {
  challenge: string;
  redirect: string;
};

const ChallengeContext = createContext<ChallengeContextType>({
  challenge: defaultChallenge,
  redirect: defaultRedirect,
});

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [challenge, setChallenge] = useState(defaultChallenge);
  const [redirect, setRedirect] = useState(defaultRedirect);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters
    const urlChallenge = searchParams.get("challenge");
    const urlRedirect = searchParams.get("redirect");

    // Update state and localStorage if URL parameters exist
    if (urlChallenge) {
      setChallenge(urlChallenge);
      localStorage.setItem("nomad-challenge", urlChallenge);
    } else {
      // Try to get from localStorage
      const storedChallenge = localStorage.getItem("nomad-challenge");
      if (storedChallenge) setChallenge(storedChallenge);
    }

    if (urlRedirect) {
      setRedirect(urlRedirect);
      localStorage.setItem("nomad-redirect", urlRedirect);
    } else {
      // Try to get from localStorage
      const storedRedirect = localStorage.getItem("nomad-redirect");
      if (storedRedirect) setRedirect(storedRedirect);
    }

    // Clear URL parameters if they exist
    if (urlChallenge || urlRedirect) {
      const url = new URL(window.location.href);
      url.searchParams.delete("challenge");
      url.searchParams.delete("redirect");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return (
    <ChallengeContext.Provider value={{ challenge, redirect }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  return context;
}
