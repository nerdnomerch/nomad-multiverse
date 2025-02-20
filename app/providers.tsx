"use client";
import { config, queryClient } from "@/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ChallengeProvider } from "@/contexts/ChallengeContext";
import { SmartAccountProvider } from "@/contexts/SmartAccountContext";

export const Providers = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={config}
        queryClient={queryClient}
        initialState={props.initialState}
      >
        <SmartAccountProvider>
          <ChallengeProvider>{props.children}</ChallengeProvider>
        </SmartAccountProvider>
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
};
