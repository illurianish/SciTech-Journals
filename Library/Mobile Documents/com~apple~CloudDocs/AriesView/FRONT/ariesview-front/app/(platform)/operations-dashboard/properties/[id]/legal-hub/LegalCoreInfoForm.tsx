"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type CoreInfo = {
  propertyName: string;
  propertyAddress: string;
  landlordName: string;
  landlordAddress: string;
  totalLeasableSqFt: string;
  propertyDocuments: File[]; // multiple
  zoningCode: string;
  easementType: string; // single
  superiorInterestHoldersCount: string;
  superiorInterestHoldersList: string;
};

export default function LegalCoreInfoForm({
  propertyId,
}: {
  propertyId: string;
}) {
  const [form, setForm] = useState<CoreInfo>({
    propertyName: "",
    propertyAddress: "",
    landlordName: "",
    landlordAddress: "",
    totalLeasableSqFt: "",
    propertyDocuments: [],
    zoningCode: "",
    easementType: "",
    superiorInterestHoldersCount: "",
    superiorInterestHoldersList: "",
  });

  const handleChange =
    (name: keyof CoreInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [name]: e.target.value }));
    };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm((p) => ({ ...p, propertyDocuments: Array.from(e.target.files) }));
  };

  const handleSubmit = () => {
    // TODO: POST to your API
    console.log("Submitting Legal Core Info for", propertyId, form);
    alert("Legal Core Info saved (stub). Check console for payload.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Labeled label="Property Name/Identifier">
          <Input
            value={form.propertyName}
            onChange={handleChange("propertyName")}
          />
        </Labeled>

        <Labeled label="Property Address">
          <Input
            value={form.propertyAddress}
            onChange={handleChange("propertyAddress")}
          />
        </Labeled>

        <Labeled label="Landlord Name">
          <Input
            value={form.landlordName}
            onChange={handleChange("landlordName")}
          />
        </Labeled>

        <Labeled label="Landlord Address">
          <Input
            value={form.landlordAddress}
            onChange={handleChange("landlordAddress")}
          />
        </Labeled>

        <Labeled label="Total Leasable Square Feet">
          <Input
            type="number"
            min={0}
            value={form.totalLeasableSqFt}
            onChange={handleChange("totalLeasableSqFt")}
          />
        </Labeled>

        <Labeled label="Zoning Code">
          <Select
            value={form.zoningCode}
            onValueChange={(v) => setForm((p) => ({ ...p, zoningCode: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select zoning…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Labeled>

        <Labeled label="Easement Type">
          <Select
            value={form.easementType}
            onValueChange={(v) => setForm((p) => ({ ...p, easementType: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Necessity">Easement by Necessity</SelectItem>
              <SelectItem value="Prescription">
                Easement by Prescription
              </SelectItem>
              <SelectItem value="ByAgreement">Easement by Agreement</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Labeled>

        <Labeled label="Property Documents Upload (PDF/DOCX/JPG/PNG)">
          <Input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFiles}
          />
        </Labeled>

        <Labeled label="Number of Superior Interest Holders">
          <Input
            type="number"
            min={0}
            value={form.superiorInterestHoldersCount}
            onChange={handleChange("superiorInterestHoldersCount")}
          />
        </Labeled>
      </div>

      <Labeled label="List of Superior Interest Holders">
        <Textarea
          rows={3}
          value={form.superiorInterestHoldersList}
          onChange={handleChange("superiorInterestHoldersList")}
        />
      </Labeled>

      <div className="pt-2">
        <Button onClick={handleSubmit}>Save Core Info</Button>
      </div>
    </div>
  );
}

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-600">{label}</div>
      {children}
    </div>
  );
}
