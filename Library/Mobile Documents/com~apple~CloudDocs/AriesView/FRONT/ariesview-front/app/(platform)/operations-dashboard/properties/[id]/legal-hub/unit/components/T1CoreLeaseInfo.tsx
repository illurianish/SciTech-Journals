"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  Input,
  NumberInput,
  TextArea,
  Select,
  OutlineButton,
} from "../components/ui";
import { UnitLevel_T1_CoreLeaseInfo } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T1_CoreLeaseInfo;
  onChange: (patch: Partial<UnitLevel_T1_CoreLeaseInfo>) => void;
  disabled?: boolean;
};

export default function T1CoreLeaseInfo({ value, onChange, disabled }: Props) {
  const u = (k: keyof UnitLevel_T1_CoreLeaseInfo, v: any) =>
    onChange({ [k]: v });

  const addText = (
    key: "leaseDocumentUpload" | "ridersAddendaExhibits",
    promptText: string
  ) => {
    const name = window.prompt(promptText);
    if (!name) return;
    const list = [...(value[key] ?? []), name];
    u(key, list);
  };

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Parent Property</Label>
          <Input
            disabled={disabled}
            value={value.parentProperty ?? ""}
            onChange={(e) => u("parentProperty", e.target.value)}
          />
        </div>
        <div>
          <Label>Lease Status</Label>
          <Input
            disabled={disabled}
            value={value.leaseStatus ?? ""}
            onChange={(e) => u("leaseStatus", e.target.value)}
          />
        </div>
        <div>
          <Label>Tenant Name</Label>
          <Input
            disabled={disabled}
            value={value.tenantName ?? ""}
            onChange={(e) => u("tenantName", e.target.value)}
          />
        </div>
        <div>
          <Label>Tenant Address</Label>
          <Input
            disabled={disabled}
            value={value.tenantAddress ?? ""}
            onChange={(e) => u("tenantAddress", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Lease Document Upload (names only)</Label>
          <div className="flex items-center gap-2">
            <OutlineButton
              disabled={disabled}
              onClick={() =>
                addText("leaseDocumentUpload", "Add file name / note:")
              }
            >
              Add
            </OutlineButton>
            <div className="text-xs text-gray-600">
              {(value.leaseDocumentUpload ?? []).join(" • ") || "—"}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Riders / Addenda / Exhibits</Label>
          <div className="flex items-center gap-2">
            <OutlineButton
              disabled={disabled}
              onClick={() =>
                addText("ridersAddendaExhibits", "Add rider/addendum/exhibit:")
              }
            >
              Add
            </OutlineButton>
            <div className="text-xs text-gray-600">
              {(value.ridersAddendaExhibits ?? []).join(" • ") || "—"}
            </div>
          </div>
        </div>

        <div>
          <Label>Lease Type</Label>
          <Select
            disabled={disabled}
            value={value.leaseType ?? ""}
            onChange={(e) => u("leaseType", e.target.value as any)}
          >
            <option value="">Select…</option>
            <option value="Gross">Gross</option>
            <option value="NNN">NNN</option>
            <option value="Modified Gross">Modified Gross</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div>
          <Label>Lease Execution Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={value.leaseExecutionDate ?? ""}
            onChange={(e) => u("leaseExecutionDate", e.target.value)}
          />
        </div>
        <div>
          <Label>Lease Commencement Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={value.leaseCommencementDate ?? ""}
            onChange={(e) => u("leaseCommencementDate", e.target.value)}
          />
        </div>
        <div>
          <Label>Rent Commencement Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={value.rentCommencementDate ?? ""}
            onChange={(e) => u("rentCommencementDate", e.target.value)}
          />
        </div>
        <div>
          <Label>Lease Expiration Date</Label>
          <Input
            disabled={disabled}
            type="date"
            value={value.leaseExpirationDate ?? ""}
            onChange={(e) => u("leaseExpirationDate", e.target.value)}
          />
        </div>

        <div>
          <Label>Lease Term (years)</Label>
          <NumberInput
            disabled={disabled}
            type="number"
            min={0}
            step="0.1"
            value={
              value.leaseTermYears === "" || value.leaseTermYears == null
                ? ""
                : value.leaseTermYears
            }
            onChange={(e) =>
              u(
                "leaseTermYears",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </div>

        <div className="md:col-span-2">
          <Label>Late Delivery Penalty</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.lateDeliveryPenalty ?? ""}
            onChange={(e) => u("lateDeliveryPenalty", e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
