export type YesNo = "Yes" | "No";

export interface UnitLevel_T1_CoreLeaseInfo {
  parentProperty?: string;
  leaseStatus?: string;
  tenantName?: string;
  tenantAddress?: string;
  leaseDocumentUpload?: string[];
  ridersAddendaExhibits?: string[];
  leaseType?: "Gross" | "NNN" | "Modified Gross" | "Other" | "";
  leaseExecutionDate?: string;
  leaseCommencementDate?: string;
  rentCommencementDate?: string;
  leaseExpirationDate?: string;
  leaseTermYears?: number | "";
  lateDeliveryPenalty?: string;
}

export interface UnitLevel_T2_PremisesUseParking {
  premisesDescription?: string;
  rentableSqFt?: number | "";
  tenantProRataShare?: number | "";
  permittedUse?: string;
  prohibitedUses?: string;
  tenantExclusiveUse?: string;
  parkingAgreement?: YesNo | "";
  exclusiveUseRentAbatement?: string;
}

export interface UnitLevel_T3_FinancialObligations {
  baseRentSchedule?: string;
  period?: string;
  annualRent?: any;
  monthlyRent?: any;
  rentFreePeriod?: string;
  addlRentTaxes?: string;
  addlRentInsurance?: string;
  addlRentCAM?: string;
  expenseCapsStops?: string;
  canTenantContestTaxes?: YesNo | "";
  securityDeposit?: string;
  liquidatedDamagesClause?: string;
  letterOfCredit?: string;
  liabilityCap?: string;
  reimbursementOfTenant?: string;
  tenantImprovementAllowance?: string;
  estimated2024NNN?: string;
}

export interface UnitLevel_T4_TenantOpsSignage {
  tenantRepairDuty?: string;
  hvacRepairReplacement?: string;
  tenantInsuranceRequirements?: string;
  insuranceType?: string;
  coverageAmount?: string;
  signageClause?: string;
  prohibitedUse?: string;
  interferenceWithSignage?: string;
  pylonMonumentSignage?: string;
}

export interface UnitLevel_T5_OptionsRights {
  tenantPurchaseOption?: YesNo | "";
  exerciseNoticePeriod?: string;
  additionalSpaceOption?: YesNo | "";
  additionalSpaceNoticePeriod?: string;
  defaultAffectsOption?: YesNo | "";
  leaseAmendmentRequired?: YesNo | "";
  newProportionateShare?: string;
  renewalExtensionOptions?: string;
  optionTerm?: string;
  rentForOptionTerm?: string;
  earlyTerminationRights?: string;
}

export interface UnitLevel_T6_LegalConsentsDefault {
  consentForAssignment?: YesNo | "";
  standardForConsentAssignment?: string;
  timePeriodForApprovalAssignment?: string;

  permittedTransfer?: YesNo | "";
  whoIsPermitted?: string;

  consentForSublease?: YesNo | "";
  standardForConsentSublease?: string;
  timePeriodForApprovalSublease?: string;

  consentForAlterations?: YesNo | "";
  consentForMajorAlterations?: string;
  consentForNonMajorAlterations?: string;

  tenantDefaultConditions?: string;
  defaultCurePeriodRent?: string;
  defaultCurePeriodOther?: string;
  holdoverRent?: string;
  landlordDefaultClause?: string;
  remediesWaiver?: string;
  landlordsDutyToMitigate?: string;
  choiceOfLaw?: string;
  guarantorFranchisor?: string;
  guarantorRights?: string;
  sndaAttached?: YesNo | "";
  leaseSubordinationType?: string;
  forceMajeureTerms?: string;
  eminentDomainClause?: string;
  compensationRights?: string;
  rightToEnterRightOfInspection?: string;
  estoppelCertificateRequirements?: string;
}

export interface UnitLevelFormData {
  t1: UnitLevel_T1_CoreLeaseInfo;
  t2: UnitLevel_T2_PremisesUseParking;
  t3: UnitLevel_T3_FinancialObligations;
  t4: UnitLevel_T4_TenantOpsSignage;
  t5: UnitLevel_T5_OptionsRights;
  t6: UnitLevel_T6_LegalConsentsDefault;
  lastEditedISO?: string;
}
