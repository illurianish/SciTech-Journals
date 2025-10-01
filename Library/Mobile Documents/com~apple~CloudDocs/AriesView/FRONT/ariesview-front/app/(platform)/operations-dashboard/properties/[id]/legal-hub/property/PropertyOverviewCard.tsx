"use client";

type Property = {
  id: string;
  name?: string;
  address?: string;
  status?: string;
  property_type?: string;
  category?: string | null;
  square_footage?: number | null;
  units?: number | null;
  acquisition_date?: string | null;
  year_built?: number | null;
  fund?: string | null;
  market_value?: number | null;
  occupancy?: number | null;
  notes?: string | null;
  // If you later store these:
  landlordName?: string | null;
  landlordAddress?: string | null;
};

function fmtCurrency(n?: number | null) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

export default function PropertyOverviewCard({
  property,
}: {
  property: Property;
}) {
  if (!property) return null;

  return (
    <div className="rounded-lg bg-white shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h3 className="text-base font-semibold text-gray-900">
          Property Overview (Read-Only)
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          These are the values you entered when creating the property.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
        <Field label="Name" value={property.name} />
        <Field label="Address" value={property.address} />

        <Field label="Status" value={property.status} />
        <Field
          label="Property Type"
          value={property.property_type || property.category}
        />

        <Field
          label="Square Footage"
          value={
            property.square_footage
              ? `${property.square_footage.toLocaleString()} sq ft`
              : "—"
          }
        />
        <Field label="Units" value={property.units ?? "—"} />

        <Field label="Fund" value={property.fund ?? "—"} />
        <Field
          label="Acquisition Date"
          value={fmtDate(property.acquisition_date)}
        />

        <Field label="Year Built" value={property.year_built ?? "—"} />
        <Field
          label="Market Value"
          value={fmtCurrency(property.market_value ?? null)}
        />

        <Field
          label="Occupancy"
          value={property.occupancy != null ? `${property.occupancy}%` : "—"}
        />
        <div className="md:col-span-2">
          <div className="text-gray-500">Notes</div>
          <div className="font-medium text-gray-900 whitespace-pre-wrap">
            {property.notes || "—"}
          </div>
        </div>

        {/* Optional if you store them on property: */}
        {property.landlordName || property.landlordAddress ? (
          <>
            <Field label="Landlord Name" value={property.landlordName ?? "—"} />
            <Field
              label="Landlord Address"
              value={property.landlordAddress ?? "—"}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value ?? "—"}</div>
    </div>
  );
}
