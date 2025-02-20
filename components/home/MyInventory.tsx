import { useSmartAccount } from "@/contexts/SmartAccountContext";
import { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Image from "next/image";
import { useSendUserOperation } from "@account-kit/react";
import { encodeFunctionData, parseAbi } from "viem";

type NFT = {
  tokenId: string;
  title: string;
  description: string;
  image: string;
  contract: string;
};

export function MyInventory() {
  const { address } = useSmartAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { client } = useSmartAccount();
  const { sendUserOperationAsync } = useSendUserOperation({ client });
  const [transferAddresses, setTransferAddresses] = useState<
    Record<string, string>
  >({});
  const [transferringNft, setTransferringNft] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) return;

      const alchemy = new Alchemy({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        network: Network.SHAPE_SEPOLIA,
      });

      try {
        const nftsForOwner = await alchemy.nft.getNftsForOwner(address);
        const formattedNfts = nftsForOwner.ownedNfts.map((nft) => ({
          tokenId: nft.tokenId,
          title: nft.name || "No name available",
          description: nft.description || "No description available",
          image: nft.image.originalUrl || "",
          contract: nft.contract.address,
        }));
        setNfts(formattedNfts);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNFTs();
  }, [address]);

  const handleTransfer = async (nft: NFT) => {
    const uniqueKey = `${nft.contract}-${nft.tokenId}`;
    const targetAddress = transferAddresses[uniqueKey];
    if (!targetAddress) {
      alert("Please enter a target address");
      return;
    }

    setTransferringNft(uniqueKey);
    try {
      const userOperation = await sendUserOperationAsync({
        uo: {
          target: nft.contract as `0x${string}`,
          data: encodeFunctionData({
            abi: parseAbi(["function transferFrom(address,address,uint256)"]),
            functionName: "transferFrom",
            args: [
              address as `0x${string}`,
              targetAddress as `0x${string}`,
              BigInt(nft.tokenId),
            ],
          }),
        },
      });
      const tx = await client?.waitForUserOperationTransaction(userOperation);
      if (tx) {
        alert("NFT transferred successfully");
        setNfts(nfts.filter((n) => `${n.contract}-${n.tokenId}` !== uniqueKey));
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed");
    } finally {
      setTransferringNft(null);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading your NFTs...</div>;
  }

  if (!address) {
    return (
      <div className="text-center">
        Please connect your wallet to view your NFTs
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {nfts.map((nft) => {
        const uniqueKey = `${nft.contract}-${nft.tokenId}`;
        const isTransferring = transferringNft === uniqueKey;
        return (
          <div key={uniqueKey} className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col items-center space-y-6">
              <Image
                src={nft.image}
                alt={nft.title}
                className="w-48 h-48 object-contain"
                width={192}
                height={192}
                unoptimized={true}
              />
              <h2 className="text-2xl font-bold text-gray-800">{nft.title}</h2>
              <p className="text-gray-600">{nft.description}</p>
              <input
                type="text"
                placeholder="Enter recipient address"
                value={transferAddresses[uniqueKey] || ""}
                onChange={(e) =>
                  setTransferAddresses({
                    ...transferAddresses,
                    [uniqueKey]: e.target.value,
                  })
                }
                disabled={isTransferring}
                className="mt-2 p-2 w-full text-gray-900 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
              <button
                onClick={() => handleTransfer(nft)}
                disabled={isTransferring}
                className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 w-full"
              >
                {isTransferring ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Transferring...
                  </span>
                ) : (
                  "Transfer Item"
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
