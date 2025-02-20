"use client";
import Image from "next/image";
import { MintableItem } from "./MintSection";

export default function MintCard({
  item,
  isLoading,
  onMint,
}: {
  item: MintableItem;
  isLoading: boolean;
  onMint: () => Promise<void>;
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <Image
          src={item.image}
          alt={item.name}
          className="w-48 h-48 object-contain"
          width={192}
          height={192}
          unoptimized={true}
        />
        <h2 className="text-3xl font-bold text-gray-800">{item.name}</h2>
        <p className="text-gray-600 text-center">{item.description}</p>
        <button
          onClick={onMint}
          disabled={isLoading}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? (
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
              Minting...
            </span>
          ) : (
            "Mint Item"
          )}
        </button>
      </div>
    </div>
  );
}
