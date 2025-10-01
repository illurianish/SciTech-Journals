"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  TextArea,
  Input,
} from "../components/ui";
import { UnitLevel_T4_TenantOpsSignage } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T4_TenantOpsSignage;
  onChange: (p: Partial<UnitLevel_T4_TenantOpsSignage>) => void;
  disabled?: boolean;
};

export default function T4TenantOpsSignage({
  value,
  onChange,
  disabled,
}: Props) {
  const u = (k: keyof UnitLevel_T4_TenantOpsSignage, v: any) =>
    onChange({ [k]: v });

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Tenant Repair Duty</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.tenantRepairDuty ?? ""}
            onChange={(e) => u("tenantRepairDuty", e.target.value)}
          />
        </div>
        <div>
          <Label>HVAC Repair/Replacement</Label>
          <Input
            disabled={disabled}
            value={value.hvacRepairReplacement ?? ""}
            onChange={(e) => u("hvacRepairReplacement", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Tenant Insurance Requirements</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.tenantInsuranceRequirements ?? ""}
            onChange={(e) => u("tenantInsuranceRequirements", e.target.value)}
          />
        </div>
        <div>
          <Label>Insurance Type</Label>
          <Input
            disabled={disabled}
            value={value.insuranceType ?? ""}
            onChange={(e) => u("insuranceType", e.target.value)}
          />
        </div>
        <div>
          <Label>Coverage Amount</Label>
          <Input
            disabled={disabled}
            value={value.coverageAmount ?? ""}
            onChange={(e) => u("coverageAmount", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Signage Clause</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.signageClause ?? ""}
            onChange={(e) => u("signageClause", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Prohibited Use</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.prohibitedUse ?? ""}
            onChange={(e) => u("prohibitedUse", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Interference with Signage</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.interferenceWithSignage ?? ""}
            onChange={(e) => u("interferenceWithSignage", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Pylon/Monument Signage</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.pylonMonumentSignage ?? ""}
            onChange={(e) => u("pylonMonumentSignage", e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
