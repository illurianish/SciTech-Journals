const req_prop_add = {
	"basicInformation": {
		"name": "Oakwood apartments",
		"propertyType": "Multifamily",
		"status": "evaluation",
		"fund": "AriesView Fund I",
		"tags": [],
		"address": "123 Main Street",
		"city": "San Francisco",
		"state": "CA",
		"zipcode": "94105"
	},
	"propertyDetails": {
		"year_built": "2005",
		"square_footage": "50000",
		"psf": "400",
		"area_unit": "50",
		"units": 1,
		"landlord_name": "John Doe",
		"landlord_address": "123 Main Street"
	},
	"propertyWideFacilitiesInsuranceMaintenance": {
		"parking_facilities_description": "Street Parking",
		"landlord_repairs_facilities": "Responsible Roof",
		"landlord_insurance": [
			"General Liability",
			"Commercial Property",
			"Business Interruption",
			"Excess Liability",
			"Comprehensive"
		]
	},
}

// req_prop_details
const req_prop_details = {
	"zoningAndEasements": {
		"zoning_code": "Industrial",
		"easement_type": [
			"Easement by Necessity",
			"Easement by Prescription",
			"Easement by Condemnation",
			"Express Easement"
		]
	},
	"superiorInterestHolders": {
		"num_superior_interest_holders": "2",
		"list_superior_interest_holders": "Bank Of America"
	},
	"propertyFinancialsAndCharacteristics": {
		"analysis_start": "2025-08-29",
		"analysis_period": "5",
		"exit_valuation_noi": "T12",
		"exit_cap_rate_growth": "5",
		"market_cap_rate": "6.5",
		"discount_rate": "7.5"
	},
	"acquisitionInformation": {
		"purchase_price_method": "Manual Input",
		"upfront_capex": "250000",
		"due_diligence_costs": "2",
		"selling_cost_at_exit": "2",
		"purchase_price": "6500000"
	},
	"assumptions": {
		"financing": {
			"interest_rate_fin_assumptions": "4.5",
			"years_interest_only": "1",
			"amortization_period": "1",
			"loan_term": "1",
			"loan_to_value": "2",
			"lender_fees": "4"
		},
		"operating": {
			"vacancy_rate": "3",
			"management_fee": "4"
		}
	},
	"cashFlows": {
		"year_0": {
			"baseRent": "1200",
			"recoveryIncome": "12300",
			"otherIncome": "2500",
			"rentAbatement": "1200",
			"vacancyAmount": "1500",
			"marketing": "1200",
			"administrative": "1300",
			"utilities": "1200",
			"payroll": "15000",
			"repairAndMaintenance": "12000",
			"mgmtOfEGR": "1200",
			"insurance": "1200",
			"taxes": "1000"
		},
		"t12": {
			"baseRent": "1500",
			"recoveryIncome": "60000",
			"otherIncome": "2500",
			"rentAbatement": "1200",
			"vacancyAmount": "1500",
			"marketing": "1200",
			"administrative": "1300",
			"utilities": "1200",
			"payroll": "15000",
			"repairAndMaintenance": "12000",
			"mgmtOfEGR": "1200",
			"insurance": "1200",
			"taxes": "1000"
		},
		"pro_forma_yr1": {
			"baseRent": "2500",
			"recoveryIncome": "60000",
			"otherIncome": "2500",
			"rentAbatement": "1200",
			"vacancyAmount": "1500",
			"marketing": "1200",
			"administrative": "1300",
			"utilities": "1200",
			"payroll": "15000",
			"repairAndMaintenance": "12000",
			"mgmtOfEGR": "1200",
			"insurance": "1200",
			"taxes": "1000"
		}
	},
	"tenantInfo": {
		"year_0": {
			"rentAbatement": "1000",
			"otherAdjustments": "1500",
			"tenant_improvements": "1500",
			"leasing_commissions": "1500",
			"capital_reserves": "1500",
			"misc_capex": "1500"
		},
		"t12": {
			"rentAbatement": "1000",
			"otherAdjustments": "1200",
			"tenant_improvements": "1200",
			"leasing_commissions": "1200",
			"capital_reserves": "1200",
			"misc_capex": "1200"
		},
		"pro_forma_yr1": {
			"rentAbatement": "1000",
			"otherAdjustments": "1100",
			"tenant_improvements": "1100",
			"leasing_commissions": "1100",
			"capital_reserves": "1100",
			"misc_capex": "1100"
		},
		"year_1": {
			"rentAbatement": "1000",
			"otherAdjustments": "1050",
			"tenant_improvements": "1050",
			"leasing_commissions": "1050",
			"capital_reserves": "1050",
			"misc_capex": "1050"
		},
		"year_2": {
			"rentAbatement": "1000",
			"otherAdjustments": "1150",
			"tenant_improvements": "1150",
			"leasing_commissions": "1150",
			"capital_reserves": "1150",
			"misc_capex": "1150"
		},
		"year_3": {
			"rentAbatement": "1000",
			"otherAdjustments": "1250",
			"tenant_improvements": "1250",
			"leasing_commissions": "1250",
			"capital_reserves": "1250",
			"misc_capex": "1250"
		},
		"year_4": {
			"rentAbatement": "1000",
			"otherAdjustments": "1175",
			"tenant_improvements": "1175",
			"leasing_commissions": "1175",
			"capital_reserves": "1175",
			"misc_capex": "1175"
		},
		"year_5": {
			"rentAbatement": "1000",
			"otherAdjustments": "1275",
			"tenant_improvements": "1275",
			"leasing_commissions": "1275",
			"capital_reserves": "1275",
			"misc_capex": "1275"
		},
		"year_6": {
			"rentAbatement": "1000",
			"otherAdjustments": "1154",
			"tenant_improvements": "1154",
			"leasing_commissions": "1154",
			"capital_reserves": "1154",
			"misc_capex": "1154"
		},
		"year_7": {
			"rentAbatement": "1000",
			"otherAdjustments": "1254",
			"tenant_improvements": "1254",
			"leasing_commissions": "1254",
			"capital_reserves": "1254",
			"misc_capex": "1254"
		},
		"year_8": {
			"rentAbatement": "1000",
			"otherAdjustments": "1344",
			"tenant_improvements": "1344",
			"leasing_commissions": "1344",
			"capital_reserves": "1344",
			"misc_capex": "1344"
		},
		"year_9": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1222",
			"leasing_commissions": "1222",
			"capital_reserves": "1222",
			"misc_capex": "1222"
		},
		"year_10": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1550",
			"capital_reserves": "1550",
			"misc_capex": "1550"
		},
		"year_11": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1250",
			"capital_reserves": "1250",
			"misc_capex": "1250"
		},
		"year_12": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1150",
			"capital_reserves": "1300",
			"misc_capex": "1200"
		},
		"year_13": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1150",
			"capital_reserves": "1300",
			"misc_capex": "1200"
		},
		"year_14": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1150",
			"capital_reserves": "1300",
			"misc_capex": "1200"
		},
		"year_15": {
			"rentAbatement": "1000",
			"otherAdjustments": "1222",
			"tenant_improvements": "1100",
			"leasing_commissions": "1150",
			"capital_reserves": "1300",
			"misc_capex": "1200"
		}
	},
	"growthRates": {
		"year_1": {
			"vacancyGrowthRate": "1",
			"incomeGrowthRate": "11",
			"opexGrowthExcludingTaxesRate": "11",
			"propertyTaxGrowthRate": "1",
			"capExGrowthRate": "1",
			"propertyManagementFeeRate": "3"
		},
		"year_2": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "2",
			"opexGrowthExcludingTaxesRate": "1",
			"propertyTaxGrowthRate": "2",
			"capExGrowthRate": "1",
			"propertyManagementFeeRate": "2"
		},
		"year_3": {
			"vacancyGrowthRate": "4",
			"incomeGrowthRate": "3",
			"opexGrowthExcludingTaxesRate": "3",
			"propertyTaxGrowthRate": "3",
			"capExGrowthRate": "3",
			"propertyManagementFeeRate": "3"
		},
		"year_4": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "2",
			"opexGrowthExcludingTaxesRate": "2",
			"propertyTaxGrowthRate": "2",
			"capExGrowthRate": "2",
			"propertyManagementFeeRate": "2"
		},
		"year_5": {
			"vacancyGrowthRate": "4",
			"incomeGrowthRate": "4",
			"opexGrowthExcludingTaxesRate": "4",
			"propertyTaxGrowthRate": "4",
			"capExGrowthRate": "4",
			"propertyManagementFeeRate": "4"
		},
		"year_6": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "5",
			"opexGrowthExcludingTaxesRate": "4",
			"propertyTaxGrowthRate": "5",
			"capExGrowthRate": "4",
			"propertyManagementFeeRate": "5"
		},
		"year_7": {
			"vacancyGrowthRate": "4",
			"incomeGrowthRate": "6",
			"opexGrowthExcludingTaxesRate": "3",
			"propertyTaxGrowthRate": "3",
			"capExGrowthRate": "2",
			"propertyManagementFeeRate": "1"
		},
		"year_8": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "3",
			"opexGrowthExcludingTaxesRate": "2",
			"propertyTaxGrowthRate": "3",
			"capExGrowthRate": "2",
			"propertyManagementFeeRate": "1"
		},
		"year_9": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "2",
			"opexGrowthExcludingTaxesRate": "2",
			"propertyTaxGrowthRate": "3",
			"capExGrowthRate": "4",
			"propertyManagementFeeRate": "1"
		},
		"year_10": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "1",
			"opexGrowthExcludingTaxesRate": "1",
			"propertyTaxGrowthRate": "2",
			"capExGrowthRate": "3",
			"propertyManagementFeeRate": "4"
		},
		"year_11": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "2",
			"opexGrowthExcludingTaxesRate": "2",
			"propertyTaxGrowthRate": "1",
			"capExGrowthRate": "2",
			"propertyManagementFeeRate": "1"
		},
		"year_12": {
			"vacancyGrowthRate": "2",
			"incomeGrowthRate": "3",
			"opexGrowthExcludingTaxesRate": "2",
			"propertyTaxGrowthRate": "6",
			"capExGrowthRate": "4",
			"propertyManagementFeeRate": "4"
		},
		"year_13": {
			"vacancyGrowthRate": "1",
			"incomeGrowthRate": "4",
			"opexGrowthExcludingTaxesRate": "3",
			"propertyTaxGrowthRate": "2",
			"capExGrowthRate": "3",
			"propertyManagementFeeRate": "1"
		},
		"year_14": {
			"vacancyGrowthRate": "1",
			"incomeGrowthRate": "5",
			"opexGrowthExcludingTaxesRate": "4",
			"propertyTaxGrowthRate": "3",
			"capExGrowthRate": "2",
			"propertyManagementFeeRate": "2"
		},
		"year_15": {
			"vacancyGrowthRate": "1",
			"incomeGrowthRate": "1",
			"opexGrowthExcludingTaxesRate": "5",
			"propertyTaxGrowthRate": "1",
			"capExGrowthRate": "6",
			"propertyManagementFeeRate": "3"
		}
	}
}

const req_prop_unit_add = {
	"unitInformation": [
		{
			"unitNumber": "1",
			"status": "Occupied",
			"tenantName": "Tenant A",
			"leaseType": "Gross Lease",
			"y0MonthlyRent": "53766.5",
			"y0ProFormaAnnualizedGross": "645198",
			"t12MonthlyRent": "65166.7",
			"t12ProFormaAnnualizedGross": "782194",
			"proFormaMonthlyRent": "65166.7",
			"proFormaAnnualizedGross": "782194",
			"leaseFrom": "2025-08-29",
			"leaseTo": "2025-08-29",
			"monthsRemaining": "120",
			"amendmentType": "None",
			"rentableAreaSF": "20000",
			"parentProperty": "Property A",
			"leaseStatus": "Active",
			"tenantAddress": "123 Elm Street",
			"leaseDocumentUpload": [],
			"ridersAddendumsExhibits": [],
			"leaseExecutionDate": "2025-08-29",
			"leaseCommencementDate": "2025-09-08",
			"leaseExpirationDate": "2026-08-29",
			"premisesDescription": "Lease Unit for F",
			"tenantProRataShare": "10",
			"permittedUse": "Can use Utilities.",
			"prohibitedUses": "Do not make any holes to walls",
			"tenantExclusiveUse": "Use for Living",
			"parkingAgreement": "All Necessary Parking",
			"numberOfSpaces": "",
			"baseRentSchedule": [],
			"rentFreePeriod": "2",
			"additionalRentTaxes": "120",
			"additionalRentInsurance": "120",
			"additionalRentCAM": "120",
			"expenseCapsSteps": "Caps for dumpster is 20 bags",
			"canTenantContestTaxes": 1,
			"timePeriod": "12",
			"securityDeposit": 1,
			"securityDepositCurrency": "1200",
			"liquidatedDamagesClause": 0,
			"liquidatedDamagesCurrency": "",
			"letterOfCredit": 1,
			"letterOfCreditCurrency": "1200",
			"liabilityCap": "50000",
			"tenantRepairDuty": "If there is any utility damage, inform earliest possible.",
			"hvacRepairReplacement": "caps",
			"tenantInsuranceRequirements": [],
			"signageClause": "signs",
			"interferenceWithSignage": "Landlord can remove, block, interfere, or tamper with signage",
			"pylonMonumentSignage": 1,
			"prohibitedUseT4": "stairs",
			"tenantPurchaseOption": 1,
			"tenantPurchaseExerciseNotice": "45 days",
			"additionalOptionSpaces": 0,
			"additionalOptionExerciseNotice": "",
			"additionalOptionDefaultAffectsOption": "",
			"additionalOptionLeaseAmendmentRequired": "",
			"additionalOptionNewProportionateShare": "",
			"additionalOptionNewProportionateSharePercentage": "",
			"renewalExtensionOptions": [],
			"renewalExtensionOptionTerm": "",
			"renewalExtensionNoticePeriod": "",
			"renewalExtensionRentForOptionTerm": "",
			"earlyTerminationRights": "Can terminate if there is any issue",
			"consentForAssignment": 1,
			"standardForConsentAssignment": "Sole Discretion",
			"timePeriodForApprovalAssignment": "5",
			"consentForSublease": 1,
			"standardForConsentSublease": "Sole Discretion",
			"timePeriodForApprovalSublease": "5",
			"consentForAlterations": 1,
			"consentForMajorAlterations": 1,
			"majorDefinition": "Major",
			"consentForNonMajorAlterations": 0,
			"nonMajorDefinition": "",
			"tenantDefaultConditions": [
				"Failure to pay rent",
				"Failure to perform",
				"Insolvency",
				"Other"
			],
			"defaultCurePeriodRent": "10",
			"defaultCurePeriodOther": "3",
			"holdoverRent": "150",
			"landlordDefaultClause": 1,
			"remediesWaiver": 1,
			"landlordsDutyToMitigate": 1,
			"choiceOfLaw": "Alabama",
			"guarantorEndorser": "John Doe",
			"guarantorRights": "Government Employee",
			"sndaAttachedToLease": 1,
			"leaseSubordinationType": "Automatic",
			"forceMajeureTerms": [
				"Acts of God",
				"Floods",
				"Fires",
				"Earthquakes",
				"Wars",
				"Pandemics",
				"Strikes",
				"Other"
			],
			"eminentDomainClause": "Total Taking",
			"compensationRights": [
				"Just Compensation",
				"Improvements",
				"Relocation Benefits"
			],
			"rightToEnterRightOfInspection": "Scope",
			"estoppelCertificateRequirements": "Estoppel",
			"selectedCategory": "lease",
			"leaseFiles": [
				{}
			]
		}
	]
}


export default {req_prop_add, req_prop_details, req_prop_unit_add};