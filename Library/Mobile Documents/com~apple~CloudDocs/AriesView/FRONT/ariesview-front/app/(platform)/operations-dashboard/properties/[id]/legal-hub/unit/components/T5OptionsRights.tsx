"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  TextArea,
  Input,
  YesNo,
} from "../components/ui";
import { UnitLevel_T5_OptionsRights } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T5_OptionsRights;
  onChange: (p: Partial<UnitLevel_T5_OptionsRights>) => void;
  disabled?: boolean;
};

export default function T5OptionsRights({ value, onChange, disabled }: Props) {
  const u = (k: keyof UnitLevel_T5_OptionsRights, v: any) =>
    onChange({ [k]: v });

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Tenant Purchase Option</Label>
          <YesNo
            disabled={disabled}
            value={value.tenantPurchaseOption ?? ""}
            onChange={(v) => u("tenantPurchaseOption", v)}
          />
        </div>
        <div>
          <Label>Exercise Notice Period</Label>
          <Input
            disabled={disabled}
            value={value.exerciseNoticePeriod ?? ""}
            onChange={(e) => u("exerciseNoticePeriod", e.target.value)}
          />
        </div>
        <div>
          <Label>Additional Space Option</Label>
          <YesNo
            disabled={disabled}
            value={value.additionalSpaceOption ?? ""}
            onChange={(v) => u("additionalSpaceOption", v)}
          />
        </div>
        <div>
          <Label>Additional Space Notice Period</Label>
          <Input
            disabled={disabled}
            value={value.additionalSpaceNoticePeriod ?? ""}
            onChange={(e) => u("additionalSpaceNoticePeriod", e.target.value)}
          />
        </div>
        <div>
          <Label>Default Affects Option?</Label>
          <YesNo
            disabled={disabled}
            value={value.defaultAffectsOption ?? ""}
            onChange={(v) => u("defaultAffectsOption", v)}
          />
        </div>
        <div>
          <Label>Lease Amendment Required?</Label>
          <YesNo
            disabled={disabled}
            value={value.leaseAmendmentRequired ?? ""}
            onChange={(v) => u("leaseAmendmentRequired", v)}
          />
        </div>
        <div>
          <Label>New Proportionate Share</Label>
          <Input
            disabled={disabled}
            value={value.newProportionateShare ?? ""}
            onChange={(e) => u("newProportionateShare", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Renewal/Extension Options</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.renewalExtensionOptions ?? ""}
            onChange={(e) => u("renewalExtensionOptions", e.target.value)}
          />
        </div>
        <div>
          <Label>Option Term</Label>
          <Input
            disabled={disabled}
            value={value.optionTerm ?? ""}
            onChange={(e) => u("optionTerm", e.target.value)}
          />
        </div>
        <div>
          <Label>Rent for Option Term</Label>
          <Input
            disabled={disabled}
            value={value.rentForOptionTerm ?? ""}
            onChange={(e) => u("rentForOptionTerm", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Early Termination Rights</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.earlyTerminationRights ?? ""}
            onChange={(e) => u("earlyTerminationRights", e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
