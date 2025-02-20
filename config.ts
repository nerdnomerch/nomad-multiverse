import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, shapeSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [{ type: "social", authProviderId: "google", mode: "popup" }],
    ],
    addPasskeyOnSignup: false,
  },
};

if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_KEY environment variable");
}
if (!process.env.NEXT_PUBLIC_POLICY_ID) {
  throw new Error("Missing NEXT_PUBLIC_POLICY_ID environment variable");
}

export const config = createConfig(
  {
    transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    chain: shapeSepolia,
    policyId: process.env.NEXT_PUBLIC_POLICY_ID,
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 24 * 3, // 3 days
    },
  },
  uiConfig
);

export const queryClient = new QueryClient();
