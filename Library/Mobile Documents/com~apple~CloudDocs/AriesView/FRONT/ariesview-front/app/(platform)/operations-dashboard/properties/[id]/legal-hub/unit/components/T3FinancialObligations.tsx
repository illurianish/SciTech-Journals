"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  TextArea,
  Input,
  CurrencyInput,
  YesNo,
} from "../components/ui";
import { UnitLevel_T3_FinancialObligations } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T3_FinancialObligations;
  onChange: (p: Partial<UnitLevel_T3_FinancialObligations>) => void;
  disabled?: boolean;
};

export default function T3FinancialObligations({
  value,
  onChange,
  disabled,
}: Props) {
  const u = (k: keyof UnitLevel_T3_FinancialObligations, v: any) =>
    onChange({ [k]: v });

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Base Rent Schedule</Label>
          <TextArea
            disabled={disabled}
            rows={3}
            value={value.baseRentSchedule ?? ""}
            onChange={(e) => u("baseRentSchedule", e.target.value)}
          />
        </div>
        <div>
          <Label>Period</Label>
          <Input
            disabled={disabled}
            placeholder="Monthly / Annual / Other"
            value={value.period ?? ""}
            onChange={(e) => u("period", e.target.value)}
          />
        </div>
        <div>
          <Label>Annual Rent</Label>
          <CurrencyInput
            disabled={disabled}
            value={value.annualRent?.toString() ?? ""}
            onChange={(v) => u("annualRent", v)}
          />
        </div>
        <div>
          <Label>Monthly Rent</Label>
          <CurrencyInput
            disabled={disabled}
            value={value.monthlyRent?.toString() ?? ""}
            onChange={(v) => u("monthlyRent", v)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Rent-Free Period</Label>
          <Input
            disabled={disabled}
            value={value.rentFreePeriod ?? ""}
            onChange={(e) => u("rentFreePeriod", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Additional Rent: Taxes</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.addlRentTaxes ?? ""}
            onChange={(e) => u("addlRentTaxes", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Additional Rent: Insurance</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.addlRentInsurance ?? ""}
            onChange={(e) => u("addlRentInsurance", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Additional Rent: CAM</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.addlRentCAM ?? ""}
            onChange={(e) => u("addlRentCAM", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Expense Caps / Stops</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.expenseCapsStops ?? ""}
            onChange={(e) => u("expenseCapsStops", e.target.value)}
          />
        </div>
        <div>
          <Label>Can Tenant Contest Taxes?</Label>
          <YesNo
            disabled={disabled}
            value={value.canTenantContestTaxes ?? ""}
            onChange={(v) => u("canTenantContestTaxes", v)}
          />
        </div>
        <div>
          <Label>Security Deposit</Label>
          <Input
            disabled={disabled}
            value={value.securityDeposit ?? ""}
            onChange={(e) => u("securityDeposit", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Liquidated Damages Clause</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.liquidatedDamagesClause ?? ""}
            onChange={(e) => u("liquidatedDamagesClause", e.target.value)}
          />
        </div>
        <div>
          <Label>Letter of Credit</Label>
          <Input
            disabled={disabled}
            value={value.letterOfCredit ?? ""}
            onChange={(e) => u("letterOfCredit", e.target.value)}
          />
        </div>
        <div>
          <Label>Liability Cap</Label>
          <Input
            disabled={disabled}
            value={value.liabilityCap ?? ""}
            onChange={(e) => u("liabilityCap", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Reimbursement of Tenant</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.reimbursementOfTenant ?? ""}
            onChange={(e) => u("reimbursementOfTenant", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Tenant Improvement Allowance</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.tenantImprovementAllowance ?? ""}
            onChange={(e) => u("tenantImprovementAllowance", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Estimated 2024 NNN charges</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.estimated2024NNN ?? ""}
            onChange={(e) => u("estimated2024NNN", e.target.value)}
          />
        </div>
      </div>
    </Section>
  );
}
