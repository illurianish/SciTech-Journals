"use client";

import * as React from "react";
// import FundPropertySelector from "@/components/financial/FundPropertySelector"; // optional

export default function LegalHub({ propertyId }: { propertyId: string }) {
  // later you can mirror Financial Hub selectors:
  // const [fundId, setFundId] = React.useState<string | null>(null);
  // const [propId, setPropId] = React.useState<string | null>(propertyId);

  return (
    <section className="space-y-6">
      <header className="rounded-xl bg-slate-900 text-white p-4">
        <h2 className="text-lg font-semibold">AriesView Legal Hub</h2>
      </header>

      {/* Optional: reuse your fund/property selector */}
      {/* <FundPropertySelector
        initialFundId={null}
        initialPropertyId={propertyId}
        onSelectionChange={(f, p) => { setFundId(f); setPropId(p); }}
        onCalculationsComplete={() => {}}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Leases</h3>
          <p className="text-sm text-slate-600">
            Upload, view, and track lease agreements.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Amendments</h3>
          <p className="text-sm text-slate-600">
            Modifications and riders to leases.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Compliance</h3>
          <p className="text-sm text-slate-600">
            Insurance, permits, certificates, violations.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Key Dates</h3>
          <p className="text-sm text-slate-600">
            Expirations, renewals, options, notices.
          </p>
        </div>
      </div>
    </section>
  );
}
