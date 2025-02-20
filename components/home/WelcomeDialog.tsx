"use client";
import { useAuthModal } from "@account-kit/react";
import { HikerIcon } from "@/components/home/icons/HikerIcon";

export function WelcomeDialog() {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24">
          <HikerIcon />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Nomad</h1>
          <p className="text-xl text-gray-600">Your Multiverse Account</p>
          <p className="text-gray-500">Login to get started</p>
        </div>

        <button
          onClick={openAuthModal}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md
            hover:bg-blue-700 transition-colors duration-200
            flex items-center justify-center space-x-2"
        >
          <span>Login</span>
        </button>
      </div>
    </div>
  );
}
