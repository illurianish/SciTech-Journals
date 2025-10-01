"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  Input,
  NumberInput,
  TextArea,
  YesNo,
} from "../components/ui";
import { UnitLevel_T2_PremisesUseParking } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T2_PremisesUseParking;
  onChange: (patch: Partial<UnitLevel_T2_PremisesUseParking>) => void;
  disabled?: boolean;
};

export default function T2PremisesUseParking({
  value,
  onChange,
  disabled,
}: Props) {
  const u = (k: keyof UnitLevel_T2_PremisesUseParking, v: any) =>
    onChange({ [k]: v });

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Premises Description</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.premisesDescription ?? ""}
            onChange={(e) => u("premisesDescription", e.target.value)}
          />
        </div>
        <div>
          <Label>Rentable Square Feet</Label>
          <NumberInput
            disabled={disabled}
            type="number"
            min={0}
            step="1"
            value={
              value.rentableSqFt === "" || value.rentableSqFt == null
                ? ""
                : value.rentableSqFt
            }
            onChange={(e) =>
              u(
                "rentableSqFt",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </div>
        <div>
          <Label>Tenant’s Pro-Rata Share (%)</Label>
          <NumberInput
            disabled={disabled}
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={
              value.tenantProRataShare === "" ||
              value.tenantProRataShare == null
                ? ""
                : value.tenantProRataShare
            }
            onChange={(e) =>
              u(
                "tenantProRataShare",
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </div>
        <div className="md:col-span-2">
          <Label>Permitted Use</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.permittedUse ?? ""}
            onChange={(e) => u("permittedUse", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Prohibited Uses</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.prohibitedUses ?? ""}
            onChange={(e) => u("prohibitedUses", e.target.value)}
          />
        </div>
        <div>
          <Label>Tenant’s Exclusive Use</Label>
          <Input
            disabled={disabled}
            value={value.tenantExclusiveUse ?? ""}
            onChange={(e) => u("tenantExclusiveUse", e.target.value)}
          />
        </div>
        <div>
          <Label>Parking Agreement</Label>
          <YesNo
            disabled={disabled}
            value={value.parkingAgreement ?? ""}
            onChange={(v) => u("parkingAgreement", v)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Exclusive Use Rent Abatement</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.exclusiveUseRentAbatement ?? ""}
            onChange={(e) => u("exclusiveUseRentAbatement", e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
