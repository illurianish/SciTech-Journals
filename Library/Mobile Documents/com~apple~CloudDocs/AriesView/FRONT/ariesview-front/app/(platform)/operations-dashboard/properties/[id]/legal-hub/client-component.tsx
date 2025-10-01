"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";

const PropertyLevelTab = dynamic(() => import("./property/PropertyLevelTab"), {
  ssr: false,
});
const UnitLevelTab = dynamic(() => import("./unit/UnitLevelTab"), {
  ssr: false,
});

type Props = { propertyId: string };

export default function LegalHubClient({ propertyId }: Props) {
  const sp = useSearchParams();
  const router = useRouter();

  const tabFromUrl = sp.get("tab") === "unit" ? "unit" : "property";
  const [active, setActive] = useState<"property" | "unit">(tabFromUrl);

  const onTabClick = (t: "property" | "unit") => {
    setActive(t);
    const params = new URLSearchParams(sp.toString());
    params.set("tab", t);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-[#0B1326] text-white px-6 py-4 shadow-sm">
        <h2 className="text-lg font-semibold">AriesView Legal Analysis Hub</h2>
      </div>

      <div className="rounded-lg bg-white shadow-sm border">
        <div className="px-4 pt-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => onTabClick("property")}
                className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium ${
                  active === "property"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Property Level
              </button>

              <button
                onClick={() => onTabClick("unit")}
                className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium ${
                  active === "unit"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Unit Level
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {active === "property" ? (
            <PropertyLevelTab propertyId={propertyId} />
          ) : (
            <UnitLevelTab propertyId={propertyId} />
          )}
        </div>
      </div>
    </div>
  );
}
