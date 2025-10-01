from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin # current_app is fine within route functions
from firebase_admin import auth
from decimal import Decimal

from models import (
  db, Property, CashFlowInputs, CashFlowProjectionYearly, TenantProfileYearly,
  IncomeStatementSummary
)

income_bp = Blueprint('income_statement', __name__)

# Updated mock data to match your working calculation
# MOCK_INCOME_INPUTS = {
#     "net_rentable_area": 50000,
#     "base_rent": 35.00,        # $35.00 / SF
#     "recovery_income": 13.70,  # $13.70 / SF
#     "other_income": 2.00,      # $2.00 / SF
#     "rent_abatement": 0.00,    # $0.00 / SF (empty in target)
#     "vacancy": 5.07,           # $5.07 / SF
#     # Operating expenses
#     "marketing": 0.30,         # $0.30 / SF
#     "administrative": 1.30,    # $1.30 / SF
#     "utilities": 1.50,         # $1.50 / SF
#     "payroll": 1.90,           # $1.90 / SF
#     "repair_and_maintenance": 1.70,  # $1.70 / SF
#     "management": 1.37,        # $1.37 / SF
#     "insurance": 0.70,         # $0.70 / SF
#     "taxes": 5.00,             # $5.00 / SF
#     # CapEx
#     "tenant_improvements": 0.00,    # $0.00 / SF (empty in target)
#     "leasing_commissions": 0.00,    # $0.00 / SF (empty in target)
#     "capital_reserves": 0.50,       # $0.50 / SF
#     "misc_capex": 0.00,             # $0.00 / SF (empty in target)
#     "other_adjustment": 0.00        # $0.00 / SF (empty in target)
# }

@income_bp.route('/income-statement-summary/<string:property_id>', methods=['OPTIONS'])
@cross_origin()
def handle_options_request(property_id):
    """
    Handles the preflight OPTIONS request for the income statement summary endpoint.
    """
    # Simply return a 200 OK response.
    # The flask-cors global configuration will add the necessary CORS headers.
    return jsonify({}), 200

def income_statement_summary(property_id, firebase_uid):
    
    
    try:
        
        # Database input fields
        
        prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
        if not prop_data:
            current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
            return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
        
        net_rentable_area = prop_data.square_footage
        if not net_rentable_area:
            current_app.logger.warning(f"Property {property_id} is missing square footage data.")
            return jsonify({"error": "Property is missing square footage data."}), 404
        
        
        cashflow_inputs = CashFlowInputs.query.filter_by(property_id=property_id).first()
        if not cashflow_inputs:
            current_app.logger.warning(f"No cash flow inputs found for property_id: {property_id}")
            return jsonify({"error": f"No cash flow inputs found for Property ID: {property_id}"}), 404
        
        cashflow_projection_yearly = CashFlowProjectionYearly.query.filter_by(property_id=property_id).first()
        
        if not cashflow_projection_yearly:
            current_app.logger.warning(f"No yearly cash flow projections found for property_id: {property_id}")
            return jsonify({"error": f"No yearly cash flow projections found for Property ID: {property_id}"}), 404

        
        def get_cashflow_proforma_value(category):
            value_entry = CashFlowInputs.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing CashFlowInput data for property {property_id} and category '{category}'.")
                return Decimal('0.0') 
            return value_entry.pro_forma

        base_rent_proforma_year1 = get_cashflow_proforma_value('Base Rent ($)')
        recovery_income_proforma_year1 = get_cashflow_proforma_value('Recovery Income ($)')
        other_income_proforma_year1 = get_cashflow_proforma_value('Other Income ($)')
        rent_abatement_proforma_year1 = get_cashflow_proforma_value('Rent Abatement ($)')
        vacancy_proforma_year1 = get_cashflow_proforma_value('Vacancy Amount ($)')
        marketing_proforma_year1 = get_cashflow_proforma_value('Marketing ($)')
        administrative_proforma_year1 = get_cashflow_proforma_value('Administrative ($)')
        utilities_proforma_year1 = get_cashflow_proforma_value('Utilities ($)')
        payroll_proforma_year1 = get_cashflow_proforma_value('Payroll ($)')
        repair_and_maintenance_proforma_year1 = get_cashflow_proforma_value('Repair & Maintenance ($)')
        management_proforma_year1 = get_cashflow_proforma_value('Mgmt of EGR ($)')
        insurance_proforma_year1 = get_cashflow_proforma_value('Insurance ($)')
        taxes_proforma_year1 = get_cashflow_proforma_value('Taxes ($)')
        
        # Values that depend on CashFlowProjectionYearly are also handled safely
        def get_tenant_proforma_value(category, property_id):
            value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
                return Decimal('0.0')  
            return value_entry.pro_forma

        other_adjustment_proforma_year1 = get_tenant_proforma_value('Other Adjustments ($)', property_id) if get_tenant_proforma_value('Other Adjustments ($)', property_id) is not None else Decimal('1.0')
        tenant_improvements_proforma_year1 = get_tenant_proforma_value('Tenant Improvements ($)', property_id)
        leasing_commissions_proforma_year1 = get_tenant_proforma_value('Leasing Commissions ($)', property_id)
        capital_reserves_proforma_year1 = get_tenant_proforma_value('CapEx Reserves ($)', property_id)
        misc_capex_proforma_year1 = get_tenant_proforma_value('Misc. CapEx ($)', property_id)
        
        
        # Intermediate Field
        potential_gross_income_proforma_year1 = base_rent_proforma_year1 + recovery_income_proforma_year1 + other_income_proforma_year1 
        base_rent = base_rent_proforma_year1 / net_rentable_area
        recovery_income = recovery_income_proforma_year1 / net_rentable_area
        other_income = other_income_proforma_year1 / net_rentable_area
        potential_gross_income = potential_gross_income_proforma_year1 / net_rentable_area
        rent_abatement = rent_abatement_proforma_year1 / net_rentable_area
        vacancy = vacancy_proforma_year1 / net_rentable_area
        other_adjustment = other_adjustment_proforma_year1 / net_rentable_area
        effective_gross_revenue = potential_gross_income - vacancy
        marketing = marketing_proforma_year1 / net_rentable_area
        administrative = administrative_proforma_year1 / net_rentable_area  
        utilities = utilities_proforma_year1 / net_rentable_area
        payroll = payroll_proforma_year1 / net_rentable_area
        repair_and_maintenance = repair_and_maintenance_proforma_year1 / net_rentable_area
        management = management_proforma_year1 / net_rentable_area
        insurance = insurance_proforma_year1 / net_rentable_area
        taxes = taxes_proforma_year1 / net_rentable_area
        operating_expenses = marketing + administrative + utilities + payroll + repair_and_maintenance + management + insurance + taxes
        net_operating_income= effective_gross_revenue - operating_expenses
        tenant_improvements = tenant_improvements_proforma_year1 / net_rentable_area
        leasing_commissions = leasing_commissions_proforma_year1 / net_rentable_area
        capital_reserves = capital_reserves_proforma_year1 / net_rentable_area
        misc_capex = misc_capex_proforma_year1 / net_rentable_area
        capital_expenditures = tenant_improvements + leasing_commissions + capital_reserves + misc_capex
        cash_flow_from_operations = net_operating_income - capital_expenditures
        
        # Complete proforma results
        result = {
            "Base Rent ($/SF)": base_rent, 
            "Recovery Income ($/SF)": recovery_income,
            "Other Income ($/SF)": other_income,
            "Potential Gross Income ($/SF)": round(potential_gross_income, 2),
            "Rent Abatement ($/SF)": rent_abatement,
            "Vacancy ($/SF)": vacancy,
            "Other Adjustment ($/SF)": other_adjustment,
            "Effective Gross Revenue ($/SF)": round(effective_gross_revenue, 2),
            "Marketing ($/SF)": marketing,
            "Administrative ($/SF)": administrative,
            "Utilities ($/SF)": utilities,
            "Payroll ($/SF)": payroll,
            "Repair and Maintenance ($/SF)": repair_and_maintenance,
            "Management ($/SF)": management,
            "Insurance ($/SF)": insurance,
            "Taxes ($/SF)": taxes,
            "Operating Expenses ($/SF)": round(operating_expenses, 2),
            "Net Operating Income ($/SF)": round(net_operating_income, 2),
            "Tenant Improvements ($/SF)": tenant_improvements,
            "Leasing Commissions ($/SF)": leasing_commissions,
            "Capital Reserves ($/SF)": capital_reserves,
            "Misc CapEx ($/SF)": misc_capex,
            "Capital Expenditures ($/SF)": round(capital_expenditures, 2),
            "Cash Flow From Operations ($/SF)": round(cash_flow_from_operations, 2)
        }
        
        current_app.logger.info(f"Output 1 - Income Statement Calculations complete for property ID {property_id}. Result: {result}")

        from decimal import Decimal, InvalidOperation
        
        def to_decimal(value, default=None):
          if value is None:
            return default
          try:
            return Decimal(str(value))
          except InvalidOperation:
            return default
          
        income_statement_entry = IncomeStatementSummary.query.filter_by(property_id=property_id).first()
        
        if income_statement_entry: # If exists, update
          income_statement_entry.base_rent = to_decimal(result['Base Rent ($/SF)'])
          income_statement_entry.recovery_income = to_decimal(result['Recovery Income ($/SF)'])
          income_statement_entry.other_income = to_decimal(result['Other Income ($/SF)'])
          income_statement_entry.vacancy = to_decimal(result["Vacancy ($/SF)"])
          income_statement_entry.potential_gross_income = to_decimal(result['Potential Gross Income ($/SF)'])
          income_statement_entry.rent_abatement = to_decimal(result['Rent Abatement ($/SF)'])
          income_statement_entry.other_adjustment = to_decimal(result['Other Adjustment ($/SF)'])
          income_statement_entry.effective_gross_revenue = to_decimal(result['Effective Gross Revenue ($/SF)'])
          income_statement_entry.marketing = to_decimal(result['Marketing ($/SF)'])
          income_statement_entry.administrative = to_decimal(result['Administrative ($/SF)'])
          income_statement_entry.utilities = to_decimal(result["Utilities ($/SF)"])
          income_statement_entry.payroll = to_decimal(result['Payroll ($/SF)'])
          income_statement_entry.repair_and_maintenance = to_decimal(result['Repair and Maintenance ($/SF)'])
          income_statement_entry.management = to_decimal(result['Management ($/SF)'])
          income_statement_entry.insurance = to_decimal(result['Insurance ($/SF)'])
          income_statement_entry.taxes = to_decimal(result['Taxes ($/SF)'])
          income_statement_entry.operating_expenses = to_decimal(result['Operating Expenses ($/SF)'])
          income_statement_entry.net_operating_income = to_decimal(result['Net Operating Income ($/SF)'])
          income_statement_entry.tenant_improvements = to_decimal(result['Tenant Improvements ($/SF)'])
          income_statement_entry.leasing_commissions = to_decimal(result['Leasing Commissions ($/SF)'])
          income_statement_entry.capital_reserves = to_decimal(result["Capital Reserves ($/SF)"])
          income_statement_entry.misc_capex = to_decimal(result['Misc CapEx ($/SF)'])
          income_statement_entry.capital_expenditures = to_decimal(result['Capital Expenditures ($/SF)'])
          income_statement_entry.cash_flow_from_operations = to_decimal(result['Cash Flow From Operations ($/SF)'])
        else:
          new_income_statement_summary = IncomeStatementSummary(
            property_id=property_id,
            base_rent = to_decimal(result['Base Rent ($/SF)']),
            recovery_income = to_decimal(result['Recovery Income ($/SF)']),
            other_income = to_decimal(result['Other Income ($/SF)']),
            potential_gross_income = to_decimal(result['Potential Gross Income ($/SF)']),
            rent_abatement = to_decimal(result['Rent Abatement ($/SF)']),
            vacancy = to_decimal(result["Vacancy ($/SF)"]),
            other_adjustment = to_decimal(result['Other Adjustment ($/SF)']),
            effective_gross_revenue = to_decimal(result['Effective Gross Revenue ($/SF)']),
            marketing = to_decimal(result['Marketing ($/SF)']),
            administrative = to_decimal(result['Administrative ($/SF)']),
            utilities = to_decimal(result["Utilities ($/SF)"]),
            payroll = to_decimal(result['Payroll ($/SF)']),
            repair_and_maintenance = to_decimal(result['Repair and Maintenance ($/SF)']),
            management = to_decimal(result['Management ($/SF)']),
            insurance = to_decimal(result['Insurance ($/SF)']),
            taxes = to_decimal(result['Taxes ($/SF)']),
            operating_expenses = to_decimal(result['Operating Expenses ($/SF)']),
            net_operating_income = to_decimal(result['Net Operating Income ($/SF)']),
            tenant_improvements = to_decimal(result['Tenant Improvements ($/SF)']),
            leasing_commissions = to_decimal(result['Leasing Commissions ($/SF)']),
            capital_reserves = to_decimal(result['Capital Reserves ($/SF)']),
            misc_capex = to_decimal(result['Misc CapEx ($/SF)']),
            capital_expenditures = to_decimal(result['Capital Expenditures ($/SF)']),
            cash_flow_from_operations = to_decimal(result['Cash Flow From Operations ($/SF)'])
          )
          db.session.add(new_income_statement_summary)
          current_app.logger.info(f"Created new income statement summary for Property ID: {property_id}")
          
        db.session.commit()
        current_app.logger.info(f"Income Statement Summary saved/updated for Property ID: {property_id}")

        
        return result
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for income statement for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process income statement data for calculation.", "details": str(e)}), 500
      
def income_statement_summary_fast(property_id, input_data):
    
  cashflow_inputs_list = input_data.get('cashflow_inputs', [])
  tenant_profile_yearly_list = input_data.get('tenant_profile_yearly', [])
  prop_data = input_data.get('property')
  
  net_rentable_area = prop_data.square_footage
  
  from decimal import Decimal
  
  def get_cashflow_proforma_value(category):
    record = next((r for r in cashflow_inputs_list if r.category == category), None)
    if record and hasattr(record, "pro_forma"):
        # Use getattr() to dynamically get the value of the specified column
        value = getattr(record, "pro_forma")
        return Decimal(value) if value is not None else Decimal('0.0')
    return Decimal('0.0')
  
  base_rent_proforma_year1 = get_cashflow_proforma_value('Base Rent ($)')
  recovery_income_proforma_year1 = get_cashflow_proforma_value('Recovery Income ($)')
  other_income_proforma_year1 = get_cashflow_proforma_value('Other Income ($)')
  rent_abatement_proforma_year1 = get_cashflow_proforma_value('Rent Abatement ($)')
  vacancy_proforma_year1 = get_cashflow_proforma_value('Vacancy Amount ($)')
  marketing_proforma_year1 = get_cashflow_proforma_value('Marketing ($)')
  administrative_proforma_year1 = get_cashflow_proforma_value('Administrative ($)')
  utilities_proforma_year1 = get_cashflow_proforma_value('Utilities ($)')
  payroll_proforma_year1 = get_cashflow_proforma_value('Payroll ($)')
  repair_and_maintenance_proforma_year1 = get_cashflow_proforma_value('Repair & Maintenance ($)')
  management_proforma_year1 = get_cashflow_proforma_value('Mgmt of EGR ($)')
  insurance_proforma_year1 = get_cashflow_proforma_value('Insurance ($)')
  taxes_proforma_year1 = get_cashflow_proforma_value('Taxes ($)')
  
  # Values that depend on CashFlowProjectionYearly are also handled safely
  def get_tenant_proforma_value(category):
      record = next((r for r in tenant_profile_yearly_list if r.category == category), None)
      if record and hasattr(record, "pro_forma"):
          # Use getattr() to dynamically get the value of the specified column
          value = getattr(record, "pro_forma")
          return Decimal(value) if value is not None else Decimal('0.0')
      return Decimal('0.0')

  other_adjustment_proforma_year1 = get_tenant_proforma_value('Other Adjustments ($)') if get_tenant_proforma_value('Other Adjustments ($)') is not None else Decimal('1.0')
  tenant_improvements_proforma_year1 = get_tenant_proforma_value('Tenant Improvements ($)')
  leasing_commissions_proforma_year1 = get_tenant_proforma_value('Leasing Commissions ($)')
  capital_reserves_proforma_year1 = get_tenant_proforma_value('CapEx Reserves ($)')
  misc_capex_proforma_year1 = get_tenant_proforma_value('Misc. CapEx ($)')
  
  # Intermediate Field
  potential_gross_income_proforma_year1 = base_rent_proforma_year1 + recovery_income_proforma_year1 + other_income_proforma_year1 
  base_rent = base_rent_proforma_year1 / net_rentable_area
  recovery_income = recovery_income_proforma_year1 / net_rentable_area
  other_income = other_income_proforma_year1 / net_rentable_area
  potential_gross_income = potential_gross_income_proforma_year1 / net_rentable_area
  rent_abatement = rent_abatement_proforma_year1 / net_rentable_area
  vacancy = vacancy_proforma_year1 / net_rentable_area
  other_adjustment = other_adjustment_proforma_year1 / net_rentable_area
  effective_gross_revenue = potential_gross_income - vacancy
  marketing = marketing_proforma_year1 / net_rentable_area
  administrative = administrative_proforma_year1 / net_rentable_area  
  utilities = utilities_proforma_year1 / net_rentable_area
  payroll = payroll_proforma_year1 / net_rentable_area
  repair_and_maintenance = repair_and_maintenance_proforma_year1 / net_rentable_area
  management = management_proforma_year1 / net_rentable_area
  insurance = insurance_proforma_year1 / net_rentable_area
  taxes = taxes_proforma_year1 / net_rentable_area
  operating_expenses = marketing + administrative + utilities + payroll + repair_and_maintenance + management + insurance + taxes
  net_operating_income= effective_gross_revenue - operating_expenses
  tenant_improvements = tenant_improvements_proforma_year1 / net_rentable_area
  leasing_commissions = leasing_commissions_proforma_year1 / net_rentable_area
  capital_reserves = capital_reserves_proforma_year1 / net_rentable_area
  misc_capex = misc_capex_proforma_year1 / net_rentable_area
  capital_expenditures = tenant_improvements + leasing_commissions + capital_reserves + misc_capex
  cash_flow_from_operations = net_operating_income - capital_expenditures
  
  # Complete proforma results
  result = {
      "Base Rent ($/SF)": base_rent, 
      "Recovery Income ($/SF)": recovery_income,
      "Other Income ($/SF)": other_income,
      "Potential Gross Income ($/SF)": round(potential_gross_income, 2),
      "Rent Abatement ($/SF)": rent_abatement,
      "Vacancy ($/SF)": vacancy,
      "Other Adjustment ($/SF)": other_adjustment,
      "Effective Gross Revenue ($/SF)": round(effective_gross_revenue, 2),
      "Marketing ($/SF)": marketing,
      "Administrative ($/SF)": administrative,
      "Utilities ($/SF)": utilities,
      "Payroll ($/SF)": payroll,
      "Repair and Maintenance ($/SF)": repair_and_maintenance,
      "Management ($/SF)": management,
      "Insurance ($/SF)": insurance,
      "Taxes ($/SF)": taxes,
      "Operating Expenses ($/SF)": round(operating_expenses, 2),
      "Net Operating Income ($/SF)": round(net_operating_income, 2),
      "Tenant Improvements ($/SF)": tenant_improvements,
      "Leasing Commissions ($/SF)": leasing_commissions,
      "Capital Reserves ($/SF)": capital_reserves,
      "Misc CapEx ($/SF)": misc_capex,
      "Capital Expenditures ($/SF)": round(capital_expenditures, 2),
      "Cash Flow From Operations ($/SF)": round(cash_flow_from_operations, 2)
  }
  
  current_app.logger.info(f"Output 1 - Income Statement Calculations complete for property ID {property_id}. Result: {result}")

  from decimal import Decimal, InvalidOperation
  
  def to_decimal(value, default=None):
    if value is None:
      return default
    try:
      return Decimal(str(value))
    except InvalidOperation:
      return default
    
  income_statement_entry = IncomeStatementSummary.query.filter_by(property_id=property_id).first()
  
  if income_statement_entry: # If exists, update
    income_statement_entry.base_rent = to_decimal(result['Base Rent ($/SF)'])
    income_statement_entry.recovery_income = to_decimal(result['Recovery Income ($/SF)'])
    income_statement_entry.other_income = to_decimal(result['Other Income ($/SF)'])
    income_statement_entry.vacancy = to_decimal(result["Vacancy ($/SF)"])
    income_statement_entry.potential_gross_income = to_decimal(result['Potential Gross Income ($/SF)'])
    income_statement_entry.rent_abatement = to_decimal(result['Rent Abatement ($/SF)'])
    income_statement_entry.other_adjustment = to_decimal(result['Other Adjustment ($/SF)'])
    income_statement_entry.effective_gross_revenue = to_decimal(result['Effective Gross Revenue ($/SF)'])
    income_statement_entry.marketing = to_decimal(result['Marketing ($/SF)'])
    income_statement_entry.administrative = to_decimal(result['Administrative ($/SF)'])
    income_statement_entry.utilities = to_decimal(result["Utilities ($/SF)"])
    income_statement_entry.payroll = to_decimal(result['Payroll ($/SF)'])
    income_statement_entry.repair_and_maintenance = to_decimal(result['Repair and Maintenance ($/SF)'])
    income_statement_entry.management = to_decimal(result['Management ($/SF)'])
    income_statement_entry.insurance = to_decimal(result['Insurance ($/SF)'])
    income_statement_entry.taxes = to_decimal(result['Taxes ($/SF)'])
    income_statement_entry.operating_expenses = to_decimal(result['Operating Expenses ($/SF)'])
    income_statement_entry.net_operating_income = to_decimal(result['Net Operating Income ($/SF)'])
    income_statement_entry.tenant_improvements = to_decimal(result['Tenant Improvements ($/SF)'])
    income_statement_entry.leasing_commissions = to_decimal(result['Leasing Commissions ($/SF)'])
    income_statement_entry.capital_reserves = to_decimal(result["Capital Reserves ($/SF)"])
    income_statement_entry.misc_capex = to_decimal(result['Misc CapEx ($/SF)'])
    income_statement_entry.capital_expenditures = to_decimal(result['Capital Expenditures ($/SF)'])
    income_statement_entry.cash_flow_from_operations = to_decimal(result['Cash Flow From Operations ($/SF)'])
  else:
    new_income_statement_summary = IncomeStatementSummary(
      property_id=property_id,
      base_rent = to_decimal(result['Base Rent ($/SF)']),
      recovery_income = to_decimal(result['Recovery Income ($/SF)']),
      other_income = to_decimal(result['Other Income ($/SF)']),
      potential_gross_income = to_decimal(result['Potential Gross Income ($/SF)']),
      rent_abatement = to_decimal(result['Rent Abatement ($/SF)']),
      vacancy = to_decimal(result["Vacancy ($/SF)"]),
      other_adjustment = to_decimal(result['Other Adjustment ($/SF)']),
      effective_gross_revenue = to_decimal(result['Effective Gross Revenue ($/SF)']),
      marketing = to_decimal(result['Marketing ($/SF)']),
      administrative = to_decimal(result['Administrative ($/SF)']),
      utilities = to_decimal(result["Utilities ($/SF)"]),
      payroll = to_decimal(result['Payroll ($/SF)']),
      repair_and_maintenance = to_decimal(result['Repair and Maintenance ($/SF)']),
      management = to_decimal(result['Management ($/SF)']),
      insurance = to_decimal(result['Insurance ($/SF)']),
      taxes = to_decimal(result['Taxes ($/SF)']),
      operating_expenses = to_decimal(result['Operating Expenses ($/SF)']),
      net_operating_income = to_decimal(result['Net Operating Income ($/SF)']),
      tenant_improvements = to_decimal(result['Tenant Improvements ($/SF)']),
      leasing_commissions = to_decimal(result['Leasing Commissions ($/SF)']),
      capital_reserves = to_decimal(result['Capital Reserves ($/SF)']),
      misc_capex = to_decimal(result['Misc CapEx ($/SF)']),
      capital_expenditures = to_decimal(result['Capital Expenditures ($/SF)']),
      cash_flow_from_operations = to_decimal(result['Cash Flow From Operations ($/SF)'])
    )
    db.session.add(new_income_statement_summary)
    current_app.logger.info(f"Created new income statement summary for Property ID: {property_id}")
    
  db.session.commit()
  current_app.logger.info(f"Income Statement Summary saved/updated for Property ID: {property_id}")

  
  return result
        

@income_bp.route('/income-statement-summary/<string:property_id>', methods=['POST'])
@cross_origin()
def income_statement_summary_endpoint(property_id):
  """
    Income Statement Summary
    ---
    tags:
      - Output 1 - Income Statement
    description: This endpoint calculates a complete income statement summary and real estate proforma based on stored financial data for a given property_id. It expects a Firebase authentication token and relevant financial inputs in the request body.
    parameters:
      - in: path
        name: property_id
        type: string
        required: true
        description: The UUID of the property to summarize.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            idToken:
              type: string
              description: The Firebase authentication ID token (JWT) of the logged-in user.
    responses:
      200:
        description: Property summary data
        schema:
          type: object
          properties:
            Administrative ($/SF):
              type: string
              format: double
              description: Administrative costs per square foot.
              example: "11.41666666666666666666666667"
            Base Rent ($/SF):
              type: string
              format: double
              description: Base rent per square foot.
              example: "29.16666666666666666666666667"
            Capital Expenditures ($/SF):
              type: string
              format: double
              description: Capital expenditures per square foot.
              example: "0.42"
            Capital Reserves ($/SF):
              type: string
              format: double
              description: Capital reserves per square foot.
              example: "0.4166666666666666666666666667"
            Cash Flow From Operations ($/SF):
              type: string
              format: double
              description: Cash flow from operations per square foot.
              example: "18.52"
            Effective Gross Revenue ($/SF):
              type: string
              format: double
              description: Effective gross revenue per square foot.
              example: "41.83"
            Insurance ($/SF):
              type: string
              format: double
              description: Insurance costs per square foot.
              example: "1.583333333333333333333333333"
            Leasing Commissions ($/SF):
              type: string
              format: double
              description: Leasing commissions per square foot.
              example: "0"
            Management ($/SF):
              type: string
              format: double
              description: Management costs per square foot.
              example: "1.25"
            Marketing ($/SF):
              type: string
              format: double
              description: Marketing costs per square foot.
              example: "4.225"
            Misc CapEx ($/SF):
              type: string
              format: double
              description: Miscellaneous capital expenditures per square foot.
              example: "0"
            Net Operating Income ($/SF):
              type: string
              format: double
              description: Net operating income per square foot.
              example: "18.94"
            Operating Expenses ($/SF):
              type: string
              format: double
              description: Operating expenses per square foot.
              example: "22.89"
            Other Adjustment ($/SF):
              type: string
              format: double
              description: Other adjustments per square foot.
              example: "0"
            Other Income ($/SF):
              type: string
              format: double
              description: Other income per square foot.
              example: "11.41666666666666666666666667"
            Payroll ($/SF):
              type: string
              format: double
              description: Payroll costs per square foot.
              example: "0.25"
            Potential Gross Income ($/SF):
              type: string
              format: double
              description: Potential gross income per square foot.
              example: "41.83"
            Recovery Income ($/SF):
              type: string
              format: double
              description: Recovery income per square foot.
              example: "1.25"
            Rent Abatement ($/SF):
              type: string
              format: double
              description: Rent abatement per square foot.
              example: "1.666666666666666666666666667"
            Repair and Maintenance ($/SF):
              type: string
              format: double
              description: Repair and maintenance costs per square foot.
              example: "1.083333333333333333333333333"
            Taxes ($/SF):
              type: string
              format: double
              description: Taxes per square foot.
              example: "1.416666666666666666666666667"
            Tenant Improvements ($/SF):
              type: string
              format: double
              description: Tenant improvements per square foot.
              example: "0"
            Utilities ($/SF):
              type: string
              format: double
              description: Utilities costs per square foot.
              example: "1.666666666666666666666666667"
            Vacancy ($/SF):
              type: string
              format: double
              description: Vacancy rate per square foot.
              example: "0.00008333333333333333333333333333"
      400:
        description: Bad request (e.g., idToken missing from body).
      401:
        description: Invalid or expired authentication token.
      404:
        description: Property not found or access denied (property does not belong to user).
      500:
        description: Internal server error during data retrieval or calculation.
    """
    
  # Use request data if provided, otherwise use mock data
  # params = request.get_json() if request.get_json() else MOCK_INCOME_INPUTS
  print(f"Received request for income statement. Property ID received: {property_id}")
  
  current_app.logger.info(f"Received request for property summary. Property ID: {property_id}")

  # Get the request data (which should contain the Firebase ID Token)
  request_data = request.get_json()
  if not request_data:
      current_app.logger.warning("No JSON data provided in the request body.")
      return jsonify({"error": "Request body must contain JSON data."}), 400

  # Extract the full Firebase ID Token (JWT)
  id_token = request_data.get('idToken')
  if not id_token:
      current_app.logger.warning("Firebase ID Token (idToken) not provided in the request body.")
      return jsonify({"error": "Firebase ID Token (idToken) is required in the request body."}), 400

  firebase_uid = None
  try:
      # VERIFY AND DECODE THE ID TOKEN
      # This will use the Firebase Admin SDK app initialized in app.py
      decoded_token = auth.verify_id_token(id_token)
      firebase_uid = decoded_token['uid'] # This extracts the short UID

      current_app.logger.info(f"Firebase ID Token verified. Extracted UID: {firebase_uid}")

  except ValueError:
      current_app.logger.error("Invalid ID Token format.", exc_info=True)
      return jsonify({"error": "Invalid ID Token format."}), 401
  except auth.InvalidIdTokenError as e:
      current_app.logger.error(f"Invalid or expired ID Token: {e}", exc_info=True)
      return jsonify({"error": "Invalid or expired authentication token.", "details": str(e)}), 401
  except Exception as e:
      current_app.logger.error(f"Error during Firebase ID Token verification: {e}", exc_info=True)
      return jsonify({"error": "Authentication failed.", "details": str(e)}), 401
  
  statement = income_statement_summary(property_id, firebase_uid);
  return statement