"use client";
import React from "react";
import {
  Section,
  FieldLabel as Label,
  TextArea,
  Input,
  YesNo,
} from "../components/ui";
import { UnitLevel_T6_LegalConsentsDefault } from "../../../../../../../rest/types";

type Props = {
  value: UnitLevel_T6_LegalConsentsDefault;
  onChange: (p: Partial<UnitLevel_T6_LegalConsentsDefault>) => void;
  disabled?: boolean;
};

export default function T6LegalConsentsDefault({
  value,
  onChange,
  disabled,
}: Props) {
  const u = (k: keyof UnitLevel_T6_LegalConsentsDefault, v: any) =>
    onChange({ [k]: v });

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Consent for Assignment</Label>
          <YesNo
            disabled={disabled}
            value={value.consentForAssignment ?? ""}
            onChange={(v) => u("consentForAssignment", v)}
          />
        </div>
        <div>
          <Label>Time Period for Approval (Assignment)</Label>
          <Input
            disabled={disabled}
            value={value.timePeriodForApprovalAssignment ?? ""}
            onChange={(e) =>
              u("timePeriodForApprovalAssignment", e.target.value)
            }
          />
        </div>
        <div className="md:col-span-2">
          <Label>Standard for Consent (Assignment)</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.standardForConsentAssignment ?? ""}
            onChange={(e) => u("standardForConsentAssignment", e.target.value)}
          />
        </div>

        <div>
          <Label>Permitted Transfer</Label>
          <YesNo
            disabled={disabled}
            value={value.permittedTransfer ?? ""}
            onChange={(v) => u("permittedTransfer", v)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Who is Permitted</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.whoIsPermitted ?? ""}
            onChange={(e) => u("whoIsPermitted", e.target.value)}
          />
        </div>

        <div>
          <Label>Consent for Sublease</Label>
          <YesNo
            disabled={disabled}
            value={value.consentForSublease ?? ""}
            onChange={(v) => u("consentForSublease", v)}
          />
        </div>
        <div>
          <Label>Time Period for Approval (Sublease)</Label>
          <Input
            disabled={disabled}
            value={value.timePeriodForApprovalSublease ?? ""}
            onChange={(e) => u("timePeriodForApprovalSublease", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Standard for Consent (Sublease)</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.standardForConsentSublease ?? ""}
            onChange={(e) => u("standardForConsentSublease", e.target.value)}
          />
        </div>

        <div>
          <Label>Consent for Alterations</Label>
          <YesNo
            disabled={disabled}
            value={value.consentForAlterations ?? ""}
            onChange={(v) => u("consentForAlterations", v)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Consent for Major Alterations</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.consentForMajorAlterations ?? ""}
            onChange={(e) => u("consentForMajorAlterations", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Consent for Non-Major Alterations</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.consentForNonMajorAlterations ?? ""}
            onChange={(e) => u("consentForNonMajorAlterations", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <Label>Tenant Default Conditions</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.tenantDefaultConditions ?? ""}
            onChange={(e) => u("tenantDefaultConditions", e.target.value)}
          />
        </div>
        <div>
          <Label>Default Cure Period (Rent)</Label>
          <Input
            disabled={disabled}
            value={value.defaultCurePeriodRent ?? ""}
            onChange={(e) => u("defaultCurePeriodRent", e.target.value)}
          />
        </div>
        <div>
          <Label>Default Cure Period (Other)</Label>
          <Input
            disabled={disabled}
            value={value.defaultCurePeriodOther ?? ""}
            onChange={(e) => u("defaultCurePeriodOther", e.target.value)}
          />
        </div>
        <div>
          <Label>Holdover Rent</Label>
          <Input
            disabled={disabled}
            value={value.holdoverRent ?? ""}
            onChange={(e) => u("holdoverRent", e.target.value)}
          />
        </div>
        <div>
          <Label>Landlord Default Clause</Label>
          <Input
            disabled={disabled}
            value={value.landlordDefaultClause ?? ""}
            onChange={(e) => u("landlordDefaultClause", e.target.value)}
          />
        </div>
        <div>
          <Label>Remedies Waiver</Label>
          <Input
            disabled={disabled}
            value={value.remediesWaiver ?? ""}
            onChange={(e) => u("remediesWaiver", e.target.value)}
          />
        </div>
        <div>
          <Label>Landlord’s Duty to Mitigate</Label>
          <Input
            disabled={disabled}
            value={value.landlordsDutyToMitigate ?? ""}
            onChange={(e) => u("landlordsDutyToMitigate", e.target.value)}
          />
        </div>
        <div>
          <Label>Choice of Law</Label>
          <Input
            disabled={disabled}
            value={value.choiceOfLaw ?? ""}
            onChange={(e) => u("choiceOfLaw", e.target.value)}
          />
        </div>
        <div>
          <Label>Guarantor / Franchisor</Label>
          <Input
            disabled={disabled}
            value={value.guarantorFranchisor ?? ""}
            onChange={(e) => u("guarantorFranchisor", e.target.value)}
          />
        </div>
        <div>
          <Label>Guarantor Rights</Label>
          <Input
            disabled={disabled}
            value={value.guarantorRights ?? ""}
            onChange={(e) => u("guarantorRights", e.target.value)}
          />
        </div>
        <div>
          <Label>SNDA Attached to Lease</Label>
          <YesNo
            disabled={disabled}
            value={value.sndaAttached ?? ""}
            onChange={(v) => u("sndaAttached", v)}
          />
        </div>
        <div>
          <Label>Lease Subordination Type</Label>
          <Input
            disabled={disabled}
            value={value.leaseSubordinationType ?? ""}
            onChange={(e) => u("leaseSubordinationType", e.target.value)}
          />
        </div>
        <div>
          <Label>Force Majeure Terms</Label>
          <Input
            disabled={disabled}
            value={value.forceMajeureTerms ?? ""}
            onChange={(e) => u("forceMajeureTerms", e.target.value)}
          />
        </div>
        <div>
          <Label>Eminent Domain Clause</Label>
          <Input
            disabled={disabled}
            value={value.eminentDomainClause ?? ""}
            onChange={(e) => u("eminentDomainClause", e.target.value)}
          />
        </div>
        <div>
          <Label>Compensation Rights</Label>
          <Input
            disabled={disabled}
            value={value.compensationRights ?? ""}
            onChange={(e) => u("compensationRights", e.target.value)}
          />
        </div>
        <div>
          <Label>Right to Enter / Right of Inspection</Label>
          <Input
            disabled={disabled}
            value={value.rightToEnterRightOfInspection ?? ""}
            onChange={(e) => u("rightToEnterRightOfInspection", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Estoppel Certificate Requirements</Label>
          <TextArea
            disabled={disabled}
            rows={2}
            value={value.estoppelCertificateRequirements ?? ""}
            onChange={(e) =>
              u("estoppelCertificateRequirements", e.target.value)
            }
          />
        </div>
      </div>
    </Section>
  );
}
