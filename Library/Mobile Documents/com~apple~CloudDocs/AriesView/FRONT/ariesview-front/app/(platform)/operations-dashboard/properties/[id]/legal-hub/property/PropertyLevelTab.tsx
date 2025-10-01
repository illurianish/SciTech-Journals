"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/firebase/config";

/* ─────────────────────────────────────────────
   Small underline-tab button (like Unit Level)
────────────────────────────────────────────── */
function TabBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative -mb-px pb-2 px-1.5 text-sm font-medium",
        "border-b-2 focus:outline-none",
        active
          ? "border-[#0b1424] text-[#0b1424]"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const ZONING_OPTIONS = [
  "Commercial",
  "Office Zones",
  "Retail Zones",
  "Mixed-Use Zones",
  "Industrial Zones",
] as const;

const EASEMENT_OPTIONS = [
  "Easement by Necessity",
  "Easement by Prescription",
  "Easement by Condemnation",
  "Easement by Estoppel",
  "Easement by Grant",
] as const;

type Props = { propertyId: string };
type TabKey = "p1" | "p2";

export default function PropertyLevelTab({ propertyId }: Props) {
  /* ───────────────────────────
     TAB STATE (new)
  ──────────────────────────── */
  const [active, setActive] = useState<TabKey>("p1");

  /* ───────────────────────────
     EDIT MODE
  ──────────────────────────── */
  const [editing, setEditing] = useState(false);
  const disabled = !editing;
  const snapshotRef = useRef<any>(null);

  const takeSnapshot = () => {
    snapshotRef.current = {
      name,
      address,
      landlordName,
      landlordAddress,
      leasableSqFt,
      zoning,
      easements: [...easements],
      numSuperiorHolders,
      listSuperiorHolders,
      parkingFacilitiesDescription,
      landlordGeneralRepairDuty,
      landlordsInsurancePolicies,
      files,
    };
  };

  const restoreSnapshot = () => {
    const s = snapshotRef.current;
    if (!s) return;
    setName(s.name);
    setAddress(s.address);
    setLandlordName(s.landlordName);
    setLandlordAddress(s.landlordAddress);
    setLeasableSqFt(s.leasableSqFt);
    setZoning(s.zoning);
    setEasements(s.easements);
    setNumSuperiorHolders(s.numSuperiorHolders);
    setListSuperiorHolders(s.listSuperiorHolders);
    setParkingFacilitiesDescription(s.parkingFacilitiesDescription);
    setLandlordGeneralRepairDuty(s.landlordGeneralRepairDuty);
    setLandlordsInsurancePolicies(s.landlordsInsurancePolicies);
    setFiles(s.files);
  };

  /* ───────────────────────────
     P-1 Core Property Information
  ──────────────────────────── */
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [leasableSqFt, setLeasableSqFt] = useState<string>("");
  const [zoning, setZoning] = useState<string>("");
  const [easements, setEasements] = useState<string[]>([]);
  const [numSuperiorHolders, setNumSuperiorHolders] = useState<string>("");
  const [listSuperiorHolders, setListSuperiorHolders] = useState("");

  // Files
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ───────────────────────────
     P-2 Facilities / Insurance / Maintenance
  ──────────────────────────── */
  const [parkingFacilitiesDescription, setParkingFacilitiesDescription] =
    useState("");
  const [landlordGeneralRepairDuty, setLandlordGeneralRepairDuty] =
    useState("");
  const [landlordsInsurancePolicies, setLandlordsInsurancePolicies] =
    useState("");

  // state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // helpers
  const positiveInt = (v: string) =>
    v.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");

  const toggleEasement = (value: string) => {
    setEasements((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const easementSummary = useMemo(() => {
    if (easements.length === 0) return "Select easements…";
    if (easements.length <= 2) return easements.join(", ");
    return `${easements.slice(0, 2).join(", ")} +${easements.length - 2} more`;
  }, [easements]);

  async function getFirebaseAuthToken(): Promise<string | null> {
    const auth = getAuth(app);
    return new Promise((resolve, reject) => {
      const unsub = onAuthStateChanged(
        auth,
        async (user) => {
          unsub();
          if (!user) return resolve(null);
          try {
            const token = await getIdToken(user, true);
            resolve(token);
          } catch (e) {
            reject(e);
          }
        },
        (err) => {
          unsub();
          reject(err);
        }
      );
    });
  }

  /* ─────────────────────────────────────────────
     PREFILL from existing property
  ───────────────────────────────────────────── */
  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!propertyId) return;
      setLoading(true);
      try {
        const token = await getFirebaseAuthToken();
        if (!token) throw new Error("Auth required");

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${backendUrl}/api/property/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        const p = data?.property ?? data;

        if (!ignore && p) {
          setName(p.name ?? "");
          setAddress(p.address ?? "");
          setLeasableSqFt(
            p.square_footage != null ? String(p.square_footage) : ""
          );
          setLandlordName(p.landlord_name ?? p.landlordName ?? "");
          setLandlordAddress(p.landlord_address ?? p.landlordAddress ?? "");
          setZoning(p.zoning_code ?? p.zoningCode ?? "");
          setEasements(p.easement_types ?? p.easementTypes ?? []);
          setNumSuperiorHolders(
            p.num_superior_holders != null
              ? String(p.num_superior_holders)
              : p.numberOfSuperiorInterestHolders != null
              ? String(p.numberOfSuperiorInterestHolders)
              : ""
          );
          setListSuperiorHolders(
            p.list_superior_holders ?? p.listOfSuperiorInterestHolders ?? ""
          );
          setParkingFacilitiesDescription(
            p.parking_facilities_description ??
              p.parkingFacilitiesDescription ??
              ""
          );
          setLandlordGeneralRepairDuty(
            p.landlord_general_repair_duty ?? p.landlordGeneralRepairDuty ?? ""
          );
          setLandlordsInsurancePolicies(
            p.landlords_insurance_policies ?? p.landlordsInsurancePolicies ?? ""
          );

          takeSnapshot(); // baseline for Cancel
        }
      } catch (e) {
        console.error("Prefill failed:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  /* ─────────────────────────────────────────────
     SAVE
  ───────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getFirebaseAuthToken();
      if (!token) throw new Error("Auth required");

      const payload = {
        coreInfo: {
          propertyNameIdentifier: name || null,
          propertyAddress: address || null,
          landlordName: landlordName || null,
          landlordAddress: landlordAddress || null,
          totalLeasableSquareFeet: leasableSqFt ? Number(leasableSqFt) : null,
          zoningCode: zoning || null,
          easementTypes: easements,
          numberOfSuperiorInterestHolders: numSuperiorHolders
            ? Number(numSuperiorHolders)
            : null,
          listOfSuperiorInterestHolders: listSuperiorHolders || null,
        },
        sectionP2: {
          parkingFacilitiesDescription: parkingFacilitiesDescription || null,
          landlordGeneralRepairDuty: landlordGeneralRepairDuty || null,
          landlordsInsurancePolicies: landlordsInsurancePolicies || null,
        },
      };

      const form = new FormData();
      form.append("payload", JSON.stringify(payload));
      files.forEach((f) => form.append("documents", f));

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${backendUrl}/api/legal/${propertyId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      alert("Saved.");
      setEditing(false);
      takeSnapshot();
    } catch (e) {
      console.error(e);
      alert("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────────────
     EXPORT PDF
  ───────────────────────────────────────────── */
  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const token = await getFirebaseAuthToken();
      if (!token) throw new Error("Auth required");

      const payload = {
        coreInfo: {
          propertyNameIdentifier: name || null,
          propertyAddress: address || null,
          landlordName: landlordName || null,
          landlordAddress: landlordAddress || null,
          totalLeasableSquareFeet: leasableSqFt ? Number(leasableSqFt) : null,
          zoningCode: zoning || null,
          easementTypes: easements,
          numberOfSuperiorInterestHolders: numSuperiorHolders
            ? Number(numSuperiorHolders)
            : null,
          listOfSuperiorInterestHolders: listSuperiorHolders || null,
        },
        sectionP2: {
          parkingFacilitiesDescription: parkingFacilitiesDescription || null,
          landlordGeneralRepairDuty: landlordGeneralRepairDuty || null,
          landlordsInsurancePolicies: landlordsInsurancePolicies || null,
        },
        propertyDocuments: files.map((f) => ({ name: f.name, size: f.size })),
      };

      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${backendUrl}/api/legal/${propertyId}/export`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(name || "legal-hub").replace(
        /[^a-z0-9-_]+/gi,
        "_"
      )}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export PDF failed:", e);
      alert("Export failed. See console for details.");
    } finally {
      setExporting(false);
    }
  };

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-sm text-gray-500">Prefilling from property…</div>
      )}

      {/* Underline Tabs (like Unit Level) */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-6">
          <TabBtn active={active === "p1"} onClick={() => setActive("p1")}>
            Core Property Info
          </TabBtn>
          <TabBtn active={active === "p2"} onClick={() => setActive("p2")}>
            Facilities, Insurance &amp; Maintenance
          </TabBtn>
        </div>
      </div>

      {/* P-1: Core Property Info */}
      {active === "p1" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Name/Identifier
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g., "West Boylston Street Shoppes"`}
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Address
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Landlord Name
              </label>
              <Input
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="Owner/Landlord entity"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Landlord Address
              </label>
              <Input
                value={landlordAddress}
                onChange={(e) => setLandlordAddress(e.target.value)}
                placeholder="Mailing address for the landlord"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Leasable Square Feet
              </label>
              <Input
                inputMode="numeric"
                value={leasableSqFt}
                onChange={(e) => setLeasableSqFt(positiveInt(e.target.value))}
                placeholder="e.g., 1250"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zoning Code
              </label>
              <Select
                value={zoning}
                onValueChange={setZoning}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select zoning…" />
                </SelectTrigger>
                <SelectContent>
                  {ZONING_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Easement Type (Multi-Select)
              </label>
              <div
                className={`mt-1 rounded-md border border-gray-200 p-3 ${
                  disabled ? "opacity-60" : ""
                }`}
              >
                <div className="mb-2 text-sm text-gray-700">
                  {easementSummary}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2">
                  {EASEMENT_OPTIONS.map((opt) => {
                    const checked = easements.includes(opt);
                    return (
                      <label
                        key={opt}
                        className="inline-flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={() => !disabled && toggleEasement(opt)}
                          disabled={disabled}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Superior Interest Holders
              </label>
              <Input
                inputMode="numeric"
                value={numSuperiorHolders}
                onChange={(e) =>
                  setNumSuperiorHolders(positiveInt(e.target.value))
                }
                placeholder="e.g., 2"
                disabled={disabled}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                List of Superior Interest Holders
              </label>
              <Textarea
                rows={3}
                value={listSuperiorHolders}
                onChange={(e) => setListSuperiorHolders(e.target.value)}
                placeholder="Names/details of the superior interest holders"
                disabled={disabled}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Property Documents Upload (PDF/DOCX/JPG/PNG)
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    setFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files),
                    ]);
                    e.target.value = "";
                  }}
                  className="hidden"
                  disabled={disabled}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  Choose Files
                </Button>
                <span className="text-xs text-gray-500">
                  Allowed: PDF, DOCX, JPG, PNG
                </span>
              </div>
              {files.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex justify-between">
                      <span className="truncate pr-3">{f.name}</span>
                      <Button
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, j) => j !== i))
                        }
                        disabled={disabled}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* P-2: Facilities / Insurance / Maintenance */}
      {active === "p2" && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <h3 className="text-sm font-semibold text-gray-900">
              Section P-2: Property-Wide Facilities, Insurance & Maintenance
            </h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Parking Facilities Description
                </label>
                <Textarea
                  rows={3}
                  value={parkingFacilitiesDescription}
                  onChange={(e) =>
                    setParkingFacilitiesDescription(e.target.value)
                  }
                  placeholder="E.g., count/ratio, locations, access terms, exclusive/shared, etc."
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Landlord General Repair Duty
                </label>
                <Textarea
                  rows={3}
                  value={landlordGeneralRepairDuty}
                  onChange={(e) => setLandlordGeneralRepairDuty(e.target.value)}
                  placeholder="Summarize landlord’s general repair responsibilities"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Landlord’s Insurance Policies
                </label>
                <Textarea
                  rows={3}
                  value={landlordsInsurancePolicies}
                  onChange={(e) =>
                    setLandlordsInsurancePolicies(e.target.value)
                  }
                  placeholder="Types, limits, carriers, renewal info, etc."
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions (bottom-right) */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            // clear all fields
            setName("");
            setAddress("");
            setLandlordName("");
            setLandlordAddress("");
            setLeasableSqFt("");
            setZoning("");
            setEasements([]);
            setNumSuperiorHolders("");
            setListSuperiorHolders("");
            setFiles([]);
            setParkingFacilitiesDescription("");
            setLandlordGeneralRepairDuty("");
            setLandlordsInsurancePolicies("");
          }}
        >
          Reset
        </Button>

        {!editing ? (
          <>
            <Button
              onClick={() => {
                takeSnapshot();
                setEditing(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                restoreSnapshot();
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? "Exporting…" : "Export"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
