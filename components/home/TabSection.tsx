import { useState } from "react";
import { MintSection } from "./MintSection";
import { MyInventory } from "./MyInventory";
const TABS = {
  MINT: "Mint Stuff",
  INVENTORY: "My Inventory",
} as const;

type TabType = keyof typeof TABS;

export function TabSection() {
  const [activeTab, setActiveTab] = useState<TabType>("MINT");

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-gray-100 p-2 rounded-lg">
        <nav className="flex gap-2" aria-label="Tabs">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`
                flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all
                ${
                  activeTab === key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4 w-[800px]">
        <div className="h-[600px]  p-6">
          {activeTab === "MINT" ? <MintSection /> : <MyInventory />}
        </div>
      </div>
    </div>
  );
}
