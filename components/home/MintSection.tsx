"use client";
import { useSmartAccount } from "@/contexts/SmartAccountContext";
import { useState } from "react";
import eye from "./images/eye.png";
import key from "./images/key.gif";
import { encodeFunctionData, parseAbi } from "viem";
import MintCard from "./MintCard";

export type MintableItem = {
  name: string;
  description: string;
  image: any;
  contractAddress: `0x${string}`;
};

const MINTABLE_ITEMS: Record<string, MintableItem> = {
  sword: {
    name: "Shapecraft Eye",
    description: "Multiversal secrets within its stare",
    image: eye,
    contractAddress: "0xAA394da7d62E502a7E3dA7e11d21A74c277143d5",
  },
  key: {
    name: "Shapecraft Key",
    description: "Key to worlds, shaper of destinies",
    image: key,
    contractAddress: "0x01eB5CF188ba7d075FDf7eDF2BB8426b17CA3320",
  },
};

export function MintSection() {
  const { address, client } = useSmartAccount();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleMint = async (itemType: keyof typeof MINTABLE_ITEMS) => {
    if (!client || !address) return;

    const item = MINTABLE_ITEMS[itemType];
    setIsLoading(itemType);

    try {
      const abi = parseAbi(["function mint(address)"]);
      const mintData = encodeFunctionData({
        abi: abi,
        functionName: "mint",
        args: [address as `0x${string}`],
      });

      const userOp = await client.sendUserOperation({
        uo: {
          target: item.contractAddress,
          data: mintData,
        },
      });

      const receipt = await client.waitForUserOperationTransaction(userOp);
      alert(`Successfully minted your ${item.name}!`);
    } catch (error) {
      console.error(`Failed to mint ${item.name}:`, error);
      alert(`Failed to mint ${item.name}`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(MINTABLE_ITEMS).map(([itemType, item]) => (
        <MintCard
          key={itemType}
          item={item}
          isLoading={isLoading === itemType}
          onMint={() => handleMint(itemType as keyof typeof MINTABLE_ITEMS)}
        />
      ))}
    </div>
  );
}
