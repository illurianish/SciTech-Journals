from decimal import Decimal
import re
from flask import Blueprint, request, jsonify, current_app
from firebase_admin import auth
from flask_cors import cross_origin

from models import (
    db, Property, PropertySummary, FinancingAssumptions, IncomeStatementSummary,
    Output2, RentRollTotals, RentRollUnits, Output3, PropertyMetrics, 
    CashFlowInputs, CashFlowProjectionYearly, PropertyFinancialsAndCharacteristic,FinancialAcquisitionCost, FinancialAssumption, OperatingAssumptions,TenantProfileYearly,Units,
)

calculate_bp = Blueprint('calculate', __name__)

# --- Helper functions to convert SQLAlchemy objects to dictionaries ---
def _property_summary_to_dict(summary_obj):
    """Converts a PropertySummary object to a dictionary."""
    if not summary_obj:
        return {}
    return {
        "All-in Basis": float(summary_obj.all_in_basis) if summary_obj.all_in_basis is not None else 0,
        "Going-in Cap Rate (%)": float(summary_obj.going_in_cap_rate) if summary_obj.going_in_cap_rate is not None else 0,
        "Price/SF": float(summary_obj.price_per_sf) if summary_obj.price_per_sf is not None else 0,
        "Terminal Cap Rate (%)": float(summary_obj.terminal_cap_rate) if summary_obj.terminal_cap_rate is not None else 0,
        "Terminal Value": float(summary_obj.terminal_value) if summary_obj.terminal_value is not None else 0,
        "Year 1 NOI": float(summary_obj.year_1_noi) if summary_obj.year_1_noi is not None else 0,
        "Year 3 NOI": float(summary_obj.year_3_noi) if summary_obj.year_3_noi is not None else 0
    }

def _financing_assumptions_to_dict(financing_obj):
    """Converts a FinancingAssumptions object to a dictionary."""
    if not financing_obj:
        return {}
    return {
        "Loan Amount": float(financing_obj.loan_amount) if financing_obj.loan_amount is not None else 0,
        "Lender Fees": float(financing_obj.lender_fees) if financing_obj.lender_fees is not None else 0,
        "Equity Required": float(financing_obj.equity_required) if financing_obj.equity_required is not None else 0,
        "Annual Amortizing Payment": float(financing_obj.annual_amortizing_payment) if financing_obj.annual_amortizing_payment is not None else 0,
        "Annual Interest-Only Payment": float(financing_obj.annual_interest_only_payment) if financing_obj.annual_interest_only_payment is not None else 0
    }

def _income_statement_summary_to_dict(income_obj):
    """Converts an IncomeStatementSummary object to a dictionary."""
    if not income_obj:
        return {}
    return {
        "Administrative ($/SF)": float(income_obj.administrative) if income_obj.administrative is not None else 0,
        "Base Rent ($/SF)": float(income_obj.base_rent) if income_obj.base_rent is not None else 0,
        "Capital Expenditures ($/SF)": float(income_obj.capital_expenditures) if income_obj.capital_expenditures is not None else 0,
        "Capital Reserves ($/SF)": float(income_obj.capital_reserves) if income_obj.capital_reserves is not None else 0,
        "Cash Flow From Operations ($/SF)": float(income_obj.cash_flow_from_operations) if income_obj.cash_flow_from_operations is not None else 0,
        "Effective Gross Revenue ($/SF)": float(income_obj.effective_gross_revenue) if income_obj.effective_gross_revenue is not None else 0,
        "Insurance ($/SF)": float(income_obj.insurance) if income_obj.insurance is not None else 0,
        "Leasing Commissions ($/SF)": float(income_obj.leasing_commissions) if income_obj.leasing_commissions is not None else 0,
        "Management ($/SF)": float(income_obj.management) if income_obj.management is not None else 0,
        "Marketing ($/SF)": float(income_obj.marketing) if income_obj.marketing is not None else 0,
        "Misc CapEx ($/SF)": float(income_obj.misc_capex) if income_obj.misc_capex is not None else 0,
        "Net Operating Income ($/SF)": float(income_obj.net_operating_income) if income_obj.net_operating_income is not None else 0,
        "Operating Expenses ($/SF)": float(income_obj.operating_expenses) if income_obj.operating_expenses is not None else 0,
        "Other Adjustment ($/SF)": float(income_obj.other_adjustment) if income_obj.other_adjustment is not None else 0,
        "Other Income ($/SF)": float(income_obj.other_income) if income_obj.other_income is not None else 0,
        "Payroll ($/SF)": float(income_obj.payroll) if income_obj.payroll is not None else 0,
        "Potential Gross Income ($/SF)": float(income_obj.potential_gross_income) if income_obj.potential_gross_income is not None else 0,
        "Recovery Income ($/SF)": float(income_obj.recovery_income) if income_obj.recovery_income is not None else 0,
        "Rent Abatement ($/SF)": float(income_obj.rent_abatement) if income_obj.rent_abatement is not None else 0,
        "Repair and Maintenance ($/SF)": float(income_obj.repair_and_maintenance) if income_obj.repair_and_maintenance is not None else 0,
        "Taxes ($/SF)": float(income_obj.taxes) if income_obj.taxes is not None else 0,
        "Tenant Improvements ($/SF)": float(income_obj.tenant_improvements) if income_obj.tenant_improvements is not None else 0,
        "Utilities ($/SF)": float(income_obj.utilities) if income_obj.utilities is not None else 0,
        "Vacancy ($/SF)": float(income_obj.vacancy) if income_obj.vacancy is not None else 0
    }
    
def __property_metrics_to_dict(metrics_obj):
  if not metrics_obj:
    return {}
  return {
    "Purchase Price": float(metrics_obj.purchase_price) if metrics_obj.purchase_price is not None else 0,
    "DCF Value": float(metrics_obj.dcf_value) if metrics_obj.dcf_value is not None else 0,
    "Replacement Cost": float(metrics_obj.replacement_cost) if metrics_obj.replacement_cost is not None else 0,
    "Unlevered IRR": float(metrics_obj.unlevered_irr) if metrics_obj.unlevered_irr is not None else 0,
    "Unlevered Equity Multiple": float(metrics_obj.unlevered_equity_multiple) if metrics_obj.unlevered_equity_multiple is not None else 0,
    "Avg. Free and Clear Return": float(metrics_obj.avg_free_clear_return) if metrics_obj.avg_free_clear_return is not None else 0,
    "Levered IRR": float(metrics_obj.levered_irr) if metrics_obj.levered_irr is not None else 0,
    "Levered Equity Multiple": float(metrics_obj.levered_equity_multiple) if metrics_obj.levered_equity_multiple is not None else 0,
    "Avg. Cash-on-Cash Return": float(metrics_obj.avg_cash_on_cash_return) if metrics_obj.avg_cash_on_cash_return is not None else 0,
    "Min. DSCR (NOI)": float(metrics_obj.min_dscr_noi) if metrics_obj.min_dscr_noi is not None else 0,
    "Min. Debt Yield (NOI)": float(metrics_obj.min_debt_yield_noi) if metrics_obj.min_debt_yield_noi is not None else 0
  }
    
def __output2_to_dict(output2_list):
    """Converts an Output2 object to a dictionary."""
    if not output2_list:
        return {}

    summary_dict = {}
    projections_dict = {}

    # Map database category names to the desired JSON keys.
    # The keys here are a mix of full names and abbreviations.
    # The values are the category names stored in the 'Output2' table.
    key_mapping = {
        'Administrative': 'Administrative',
        'Base Rent': 'Base Rent',
        'Capital Expenditures': 'Capital Expenditures',
        'Capital Reserves': 'Capital Reserves',
        'CFO': 'CFO',
        'EGR': 'EGR',
        'Expense Ratio': 'Expense Ratio',
        'Expense Recovery %': 'Expense Recovery %',
        'Expenses PSF': 'Expenses PSF',
        'Insurance': 'Insurance',
        'Leasing Commissions': 'Leasing Commissions',
        'Marketing': 'Marketing',
        "Maintenance": "Maintenance",
        'Mgmt Fee': 'Mgmt Fee',
        'Misc Capex': 'Misc Capex',
        'Net Operating Income': 'Net Operating Income',
        'Opex': 'Opex',
        'Other Income': 'Other Income',
        'PGI': 'PGI',
        'Payroll': 'Payroll',
        'Recovery Income': 'Recovery Income',
        'Rent Abatement': 'Rent Abatement',
        'Rent PSF': 'Rent PSF',
        'Maintenance': 'Maintenance',
        'Taxes': 'Taxes',
        'Taxes as % of NOI': 'Taxes as % of NOI',
        'Tenant Improvement': 'Tenant Improvement',
        'Utilities': 'Utilities',
        'Vacancy': 'Vacancy',
        'Vacancy Rate': 'Vacancy Rate',
        'CapEx as % of NOI': 'CapEx as % of NOI',
    }

    # Invert the mapping to easily get the summary key from the database category.
    reverse_key_mapping = {v: k for k, v in key_mapping.items()}

    # Map the database column names to the desired JSON suffixes.
    column_mapping = {
        'year_0': 'Y0',
        't12': 'T12',
        'pro_forma': 'PF',
        'psf_pro_forma': 'PSF PF'
    }

    # Iterate through each record in the list.
    for entry in output2_list:
        db_category_name = entry.category
        json_category_name = reverse_key_mapping.get(db_category_name, db_category_name)
        
        # Populate the summary dictionary.
        summary_dict[f'{json_category_name} {column_mapping["year_0"]}'] = str(entry.year_0)
        summary_dict[f'{json_category_name} {column_mapping["t12"]}'] = str(entry.t12)
        summary_dict[f'{json_category_name} {column_mapping["pro_forma"]}'] = str(entry.pro_forma)
        if entry.psf_pro_forma is not None:
             summary_dict[f'{json_category_name} {column_mapping["psf_pro_forma"]}'] = str(round(entry.psf_pro_forma, 2))
        
        # Handle special cases.
        if db_category_name == 'Mgmt Fee':
            summary_dict['Mgmt Fee %'] = str(entry.pro_forma)
        elif db_category_name == 'Vacancy Rate':
            summary_dict['Vacancy Rate'] = str(entry.pro_forma)
        elif db_category_name == 'Net Rentable Area':
            summary_dict['Net Rentable Area'] = str(entry.pro_forma)
            
        # Build the nested projections dictionary.
        projections = {}
        for i in range(1, 12):
            year_key = f'year_{i}'
            year_value = getattr(entry, year_key, None)
            if year_value is not None:
                projections[f'Year {i}'] = str(round(year_value, 2))
            else:
                projections[f'Year {i}'] = "0.00"
        
        if projections: # Only add if there's projection data
             projections_dict[db_category_name] = projections

    # Add the final projections dictionary to the summary.
    summary_dict['projections'] = projections_dict

    return summary_dict

def __output3_to_dict(output3_list):
  
  if not output3_list:
    return {}
  
  structured_data = {}
  unlevered_irr_matrix = {}
  levered_irr_matrix = {}

  for entry in output3_list:
      category = entry.category
      
      # Check if the category is part of the IRR matrices
      if "Unlevered Internal Rate of Return Calculation" in category:
          match = re.search(r"Year (\d+)", category)
          if match:
              year = f"Year {match.group(1)}"
              row_data = {
                  "Year Ending": int(match.group(1)),
                  "IRR": f"{entry.other:.2%}" if isinstance(entry.other, Decimal) else str(entry.other),
                  "0": str(entry.year_0) if entry.year_0 is not None else "",
                  "1": str(entry.year_1) if entry.year_1 is not None else "",
                  "2": str(entry.year_2) if entry.year_2 is not None else "",
                  "3": str(entry.year_3) if entry.year_3 is not None else "",
                  "4": str(entry.year_4) if entry.year_4 is not None else "",
                  "5": str(entry.year_5) if entry.year_5 is not None else "",
                  "6": str(entry.year_6) if entry.year_6 is not None else "",
                  "7": str(entry.year_7) if entry.year_7 is not None else "",
                  "8": str(entry.year_8) if entry.year_8 is not None else "",
                  "9": str(entry.year_9) if entry.year_9 is not None else "",
                  "10": str(entry.year_10) if entry.year_10 is not None else "",
              }
              unlevered_irr_matrix[year] = row_data

      elif "Levered Internal Rate of Return Calculation" in category:
          match = re.search(r"Year (\d+)", category)
          if match:
              year = f"Year {match.group(1)}"
              row_data = {
                  "Year Ending": int(match.group(1)),
                  "IRR": f"{entry.other:.2%}" if isinstance(entry.other, Decimal) else str(entry.other),
                  "0": str(entry.year_0) if entry.year_0 is not None else "",
                  "1": str(entry.year_1) if entry.year_1 is not None else "",
                  "2": str(entry.year_2) if entry.year_2 is not None else "",
                  "3": str(entry.year_3) if entry.year_3 is not None else "",
                  "4": str(entry.year_4) if entry.year_4 is not None else "",
                  "5": str(entry.year_5) if entry.year_5 is not None else "",
                  "6": str(entry.year_6) if entry.year_6 is not None else "",
                  "7": str(entry.year_7) if entry.year_7 is not None else "",
                  "8": str(entry.year_8) if entry.year_8 is not None else "",
                  "9": str(entry.year_9) if entry.year_9 is not None else "",
                  "10": str(entry.year_10) if entry.year_10 is not None else "",
              }
              levered_irr_matrix[year] = row_data

      # Handle other categories
      else:
          if entry.other is not None:
              # This is for the single string/numeric values
              structured_data[category] = str(entry.other) if isinstance(entry.other, Decimal) else entry.other
          else:
              # This is for the yearly data
              yearly_data = {
                  "Year 0": str(entry.year_0) if entry.year_0 is not None else None,
                  "Year 1": str(entry.year_1) if entry.year_1 is not None else None,
                  "Year 2": str(entry.year_2) if entry.year_2 is not None else None,
                  "Year 3": str(entry.year_3) if entry.year_3 is not None else None,
                  "Year 4": str(entry.year_4) if entry.year_4 is not None else None,
                  "Year 5": str(entry.year_5) if entry.year_5 is not None else None,
                  "Year 6": str(entry.year_6) if entry.year_6 is not None else None,
                  "Year 7": str(entry.year_7) if entry.year_7 is not None else None,
                  "Year 8": str(entry.year_8) if entry.year_8 is not None else None,
                  "Year 9": str(entry.year_9) if entry.year_9 is not None else None,
                  "Year 10": str(entry.year_10) if entry.year_10 is not None else None,
                  "Year 11": str(entry.year_11) if entry.year_11 is not None else None,
              }
              structured_data[category] = yearly_data

  # Add the matrices to the final output
  if unlevered_irr_matrix:
      structured_data["Unlevered Internal Rate of Return Calculation"] = unlevered_irr_matrix
  if levered_irr_matrix:
      structured_data["Levered Internal Rate of Return Calculation"] = levered_irr_matrix

  return structured_data
    
  

def __rentroll_to_dict(rentroll_list):
  """
  Converts a list of RentRollUnits objects into a list of structured dictionaries.
  
  Args:
      rentroll_list (list): A list of RentRollUnits objects.
      
  Returns:
      list: A list of dictionaries, where each dictionary represents a unit.
  """
  if not rentroll_list:
      return []
      
  rent_roll_units = []
  
  # Process each unit object from the list
  for unit in rentroll_list:
      unit_dict = {
          "Unit": str(unit.unit_num),
          "Year 0": float(unit.year_0) if unit.year_0 is not None else 0.0,
          "T12": float(unit.t12) if unit.t12 is not None else 0.0,
          "Pro Forma Year 1": float(unit.pro_forma) if unit.pro_forma is not None else 0.0
      }
      rent_roll_units.append(unit_dict)
      
  return rent_roll_units

def __rentroll_total_to_dict(total):
  """
  Converts a single RentRollTotals object into a structured dictionary.
  
  Args:
      total_obj (RentRollTotals): A single RentRollTotals object.
      
  Returns:
      dict: A dictionary representing the total rent roll values.
  """
  if not total:
      return {}
      
  rent_roll_totals = {
      "Year 0": float(total.total_year_0) if total.total_year_0 is not None else 0.0,
      "T12": float(total.total_t12) if total.total_t12 is not None else 0.0,
      "Pro Forma Year 1": float(total.total_pro_forma) if total.total_pro_forma is not None else 0.0
  }
      
  return rent_roll_totals

@calculate_bp.route('/calculate/<string:property_id>', methods=['POST'])
# @cross_origin()
def trigger_calculations(property_id):
    """
    Check if output table exists, if not calculate. Triggered at front-end when property is selected.
    ---
    tags:
      - ALL Calculate Endpoint
    description: >
      This endpoint is a trigger that calculates all of the outputs at once if the data doesn't exist already.
      If it does, it will simply load the data that exists in the table.
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
        description: A dictionary containing all calculated or retrieved output tables.
        schema:
          type: object
          properties:
            property_summary:
              type: object
              description: The summary of the property's financial performance.
              properties:
                All-in Basis:
                  type: number
                  description: Total all-in basis for the property
                Going-in Cap Rate (%):
                  type: number
                  description: Going-in cap rate as a percentage
                Price/SF:
                  type: number
                  description: Price per square foot
                Year 1 NOI:
                  type: number
                  description: Year 1 Net Operating Income
                Year 3 NOI:
                  type: number
                  description: Year 3 Net Operating Income
                Terminal Cap Rate (%):
                  type: number
                  description: Terminal cap rate as a percentage
                Terminal Value:
                  type: number
                  description: Terminal value of the property
            financing_assumptions:
              type: object
              description: The financing assumptions for the property.
              properties:
                Loan Amount:
                  type: number
                  description: The total loan amount.
                Lender Fees:
                  type: number
                  description: The total lender fees.
                Equity Required:
                  type: number
                  description: The amount of equity required.
                Annual Amortizing Payment:
                  type: number
                  description: The annual principal and interest payment.
                Annual Interest-Only Payment:
                  type: number
                  description: The annual interest-only payment.
            income_statement_summary:
              type: object
              description: The income statement summary for the property.
              properties:
                Administrative ($/SF):
                  type: number
                  format: double
                  description: Administrative costs per square foot.
                Base Rent ($/SF):
                  type: number
                  format: double
                  description: Base rent per square foot.
                Capital Expenditures ($/SF):
                  type: number
                  format: double
                  description: Capital expenditures per square foot.
                Capital Reserves ($/SF):
                  type: number
                  format: double
                  description: Capital reserves per square foot.
                Cash Flow From Operations ($/SF):
                  type: number
                  format: double
                  description: Cash flow from operations per square foot.
                Effective Gross Revenue ($/SF):
                  type: number
                  format: double
                  description: Effective gross revenue per square foot.
                Insurance ($/SF):
                  type: number
                  format: double
                  description: Insurance costs per square foot.
                Leasing Commissions ($/SF):
                  type: number
                  format: double
                  description: Leasing commissions per square foot.
                Management ($/SF):
                  type: number
                  format: double
                  description: Management costs per square foot.
                Marketing ($/SF):
                  type: number
                  format: double
                  description: Marketing costs per square foot.
                Misc CapEx ($/SF):
                  type: number
                  format: double
                  description: Miscellaneous capital expenditures per square foot.
                Net Operating Income ($/SF):
                  type: number
                  format: double
                  description: Net operating income per square foot.
                Operating Expenses ($/SF):
                  type: number
                  format: double
                  description: Operating expenses per square foot.
                Other Adjustment ($/SF):
                  type: number
                  format: double
                  description: Other adjustments per square foot.
                Other Income ($/SF):
                  type: number
                  format: double
                  description: Other income per square foot.
                Payroll ($/SF):
                  type: number
                  format: double
                  description: Payroll costs per square foot.
                Potential Gross Income ($/SF):
                  type: number
                  format: double
                  description: Potential gross income per square foot.
                Recovery Income ($/SF):
                  type: number
                  format: double
                  description: Recovery income per square foot.
                Rent Abatement ($/SF):
                  type: number
                  format: double
                  description: Rent abatement per square foot.
                Repair and Maintenance ($/SF):
                  type: number
                  format: double
                  description: Repair and maintenance costs per square foot.
                Taxes ($/SF):
                  type: number
                  format: double
                  description: Taxes per square foot.
                Tenant Improvements ($/SF):
                  type: number
                  format: double
                  description: Tenant improvements per square foot.
                Utilities ($/SF):
                  type: number
                  format: double
                  description: Utilities costs per square foot.
                Vacancy ($/SF):
                  type: number
                  format: double
                  description: Vacancy rate per square foot.
      400:
        description: Bad request (e.g., idToken missing from body).
      401:
        description: Invalid or expired authentication token.
      404:
        description: Property not found or access denied (property does not belong to user).
      500:
        description: Internal server error during data retrieval or calculation.
    """
   
        
        
    print(f"Calculation Triggered - Received request for Calculation. Property ID received: {property_id}")
    
    current_app.logger.info(f"Received request for Calculation. Property ID: {property_id}")

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
    
    try:
         # IF Output 1 tables exist in the database?
        # Output 1 Tables:
        property_summary = PropertySummary.query.filter_by(property_id=property_id).first()
        income_statement_summary = IncomeStatementSummary.query.filter_by(property_id=property_id).first()
        financing_assumptions = FinancingAssumptions.query.filter_by(property_id=property_id).first()
        property_metrics = PropertyMetrics.query.filter_by(property_id=property_id).first()
        # Output 2 Tables:
        output2_list = Output2.query.filter_by(property_id=property_id).all()# Just check for the first category
        output3_list = Output3.query.filter_by(property_id=property_id).all()
        # Output 5 Tables:
        output5_rentroll_list = RentRollUnits.query.filter_by(property_id=property_id).all()
        output5_total = RentRollTotals.query.filter_by(property_id=property_id).first()
        # Other tables add here as well
        
        if property_summary and income_statement_summary and financing_assumptions and output2_list and output5_rentroll_list and output5_total and output3_list and property_metrics: # Yes! The output was calculated already
            current_app.logger.info(f"Property summary for {property_id} found. Retrieving all output tables.")
            
            response_data = {
                'property_summary': _property_summary_to_dict(property_summary), 
                'income_statement_summary':  _income_statement_summary_to_dict(income_statement_summary),
                'financing_assumptions': _financing_assumptions_to_dict(financing_assumptions),
                'property_metrics': __property_metrics_to_dict(property_metrics),
                'output2': __output2_to_dict(output2_list),
                'output3': __output3_to_dict(output3_list),
                'output5_rentroll': __rentroll_to_dict(output5_rentroll_list),
                'output5_total': __rentroll_total_to_dict(output5_total),
            }
            
            current_app.logger.info("All Output tables found. Exiting Flask Server");
            
            return jsonify(response_data)
        
        else: # No! Please calculate here & log it
            try:   
              from .property_summary import property_summary, property_summary_fast
              from .financing_assumptions import financing_assumptions, financing_assumptions_fast
              from .income_statement_summary import income_statement_summary, income_statement_summary_fast
              from .property_metrics import property_metrics, property_metrics_fast
              from .output2 import calculate_output2, calculate_output2_fast
              from .output5 import calculate_rent_roll, calculate_rent_roll_fast
              from .output3 import calculate_output3, calculate_output3_fast
              
              input_data = get_all_property_data(property_id, firebase_uid)
              
              current_app.logger.info('The Output tables were not found! Calculating now.')
              
              output2_data = calculate_output2_fast(property_id, input_data)
              print("output2 done calculating!")
              output3_data = calculate_output3_fast(property_id, input_data, output2_data)
              print("output3 done calculating")
              output5_data = calculate_rent_roll_fast(property_id, input_data)
              print("output5 done calculating")
              
              # Fetch data from the calculation functions
              property_summary_data = property_summary_fast(property_id, input_data, output3_data)
              print("property summary done calculating")
              financing_assumptions_data = financing_assumptions_fast(property_id, input_data, property_summary_data)
              print("financing assumtpiosn done calculating")
              income_statement_summary_data = income_statement_summary_fast(property_id, input_data)
              print("income statement summary done calculating")
              property_metrics_data = property_metrics_fast(property_id, input_data, output3_data)
              print("property metrics done calculating")

            
              rent_rolls = output5_data.get('rent_roll', [])
              rent_roll_totals = output5_data.get('totals', {})

              consolidated_data = {
                  'property_summary': property_summary_data,
                  'financing_assumptions': financing_assumptions_data,
                  'income_statement_summary': income_statement_summary_data,
                  'property_metrics': property_metrics_data,
                  'output2': output2_data,
                  'output3': output3_data,
                  'output5_rentroll': rent_rolls,
                  'output5_total': rent_roll_totals
              }
              
              current_app.logger.info(f"All calculations for {property_id} completed successfully.")
              current_app.logger.info("consolidated_data: ", consolidated_data);
              current_app.logger.info("Exiting flask server.");
              return jsonify(consolidated_data)
            
            except Exception as e:
                db.session.rollback() # Rollback the session on any error
                current_app.logger.error(f"Error during calculation process for {property_id}: {e}", exc_info=True)
                return jsonify({"error": "Failed to complete all calculations.", "details": str(e)}), 500
            
            
        # if not property_summary:
        #     current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
        #     return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
        
        # Yes --> retrieve all of the output tables and send it back to front-end 
        # No --> run all of the end-points
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for Calculation: {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process for calculation.", "details": str(e)}), 500
      
@calculate_bp.route('/calculate-testing/<string:property_id>', methods=['POST'])
# @cross_origin()
def trigger_calculations_testing(property_id):
    """
    FOR TESTING PURPOSES. Re-calculate the property, regardless of anything. 
    ---
    tags:
      - TESTING All Calculate Endpoint
    description: >
      This endpoint is used for TESTING PURPOSES, and a trigger that calculates all of the outputs at once if the data doesn't exist already.
      If it does, it will simply load the data that exists in the table.
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
        description: A dictionary containing all calculated or retrieved output tables.
        schema:
          type: object
          properties:
            property_summary:
              type: object
              description: The summary of the property's financial performance.
              properties:
                All-in Basis:
                  type: number
                  description: Total all-in basis for the property
                Going-in Cap Rate (%):
                  type: number
                  description: Going-in cap rate as a percentage
                Price/SF:
                  type: number
                  description: Price per square foot
                Year 1 NOI:
                  type: number
                  description: Year 1 Net Operating Income
                Year 3 NOI:
                  type: number
                  description: Year 3 Net Operating Income
                Terminal Cap Rate (%):
                  type: number
                  description: Terminal cap rate as a percentage
                Terminal Value:
                  type: number
                  description: Terminal value of the property
            financing_assumptions:
              type: object
              description: The financing assumptions for the property.
              properties:
                Loan Amount:
                  type: number
                  description: The total loan amount.
                Lender Fees:
                  type: number
                  description: The total lender fees.
                Equity Required:
                  type: number
                  description: The amount of equity required.
                Annual Amortizing Payment:
                  type: number
                  description: The annual principal and interest payment.
                Annual Interest-Only Payment:
                  type: number
                  description: The annual interest-only payment.
            income_statement_summary:
              type: object
              description: The income statement summary for the property.
              properties:
                Administrative ($/SF):
                  type: number
                  format: double
                  description: Administrative costs per square foot.
                Base Rent ($/SF):
                  type: number
                  format: double
                  description: Base rent per square foot.
                Capital Expenditures ($/SF):
                  type: number
                  format: double
                  description: Capital expenditures per square foot.
                Capital Reserves ($/SF):
                  type: number
                  format: double
                  description: Capital reserves per square foot.
                Cash Flow From Operations ($/SF):
                  type: number
                  format: double
                  description: Cash flow from operations per square foot.
                Effective Gross Revenue ($/SF):
                  type: number
                  format: double
                  description: Effective gross revenue per square foot.
                Insurance ($/SF):
                  type: number
                  format: double
                  description: Insurance costs per square foot.
                Leasing Commissions ($/SF):
                  type: number
                  format: double
                  description: Leasing commissions per square foot.
                Management ($/SF):
                  type: number
                  format: double
                  description: Management costs per square foot.
                Marketing ($/SF):
                  type: number
                  format: double
                  description: Marketing costs per square foot.
                Misc CapEx ($/SF):
                  type: number
                  format: double
                  description: Miscellaneous capital expenditures per square foot.
                Net Operating Income ($/SF):
                  type: number
                  format: double
                  description: Net operating income per square foot.
                Operating Expenses ($/SF):
                  type: number
                  format: double
                  description: Operating expenses per square foot.
                Other Adjustment ($/SF):
                  type: number
                  format: double
                  description: Other adjustments per square foot.
                Other Income ($/SF):
                  type: number
                  format: double
                  description: Other income per square foot.
                Payroll ($/SF):
                  type: number
                  format: double
                  description: Payroll costs per square foot.
                Potential Gross Income ($/SF):
                  type: number
                  format: double
                  description: Potential gross income per square foot.
                Recovery Income ($/SF):
                  type: number
                  format: double
                  description: Recovery income per square foot.
                Rent Abatement ($/SF):
                  type: number
                  format: double
                  description: Rent abatement per square foot.
                Repair and Maintenance ($/SF):
                  type: number
                  format: double
                  description: Repair and maintenance costs per square foot.
                Taxes ($/SF):
                  type: number
                  format: double
                  description: Taxes per square foot.
                Tenant Improvements ($/SF):
                  type: number
                  format: double
                  description: Tenant improvements per square foot.
                Utilities ($/SF):
                  type: number
                  format: double
                  description: Utilities costs per square foot.
                Vacancy ($/SF):
                  type: number
                  format: double
                  description: Vacancy rate per square foot.
      400:
        description: Bad request (e.g., idToken missing from body).
      401:
        description: Invalid or expired authentication token.
      404:
        description: Property not found or access denied (property does not belong to user).
      500:
        description: Internal server error during data retrieval or calculation.
    """
   
        
        
    print(f"Calculation Triggered - Received request for Calculation. Property ID received: {property_id}")
    
    current_app.logger.info(f"Received request for Calculation. Property ID: {property_id}")

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

    try:   
      from .property_summary import property_summary, property_summary_fast
      from .financing_assumptions import financing_assumptions, financing_assumptions_fast
      from .income_statement_summary import income_statement_summary, income_statement_summary_fast
      from .property_metrics import property_metrics, property_metrics_fast
      from .output2 import calculate_output2, calculate_output2_fast
      from .output5 import calculate_rent_roll, calculate_rent_roll_fast
      from .output3 import calculate_output3, calculate_output3_fast
      
      input_data = get_all_property_data(property_id, firebase_uid)
      
      current_app.logger.info('The Output tables were not found! Calculating now.')
      
      # print(input_data)
      
      output2_data = calculate_output2_fast(property_id, input_data)
      print("output2 done calculating!")
      output3_data = calculate_output3_fast(property_id, input_data, output2_data)
      # print("output3 done calculating\n", output3_data)
      output5_data = calculate_rent_roll_fast(property_id, input_data)
      # print("output5 done calculating\n", output5_data)
      
      # Fetch data from the calculation functions
      property_summary_data = property_summary_fast(property_id, input_data, output3_data)
      # print("property summary done calculating\n", property_summary_data)
      financing_assumptions_data = financing_assumptions_fast(property_id, input_data, property_summary_data)
      # print("financing assumtpiosn done calculating\n", financing_assumptions_data)
      income_statement_summary_data = income_statement_summary_fast(property_id, input_data)
      # print("income statement summary done calculating\n", income_statement_summary_data)
      property_metrics_data = property_metrics_fast(property_id, input_data, output3_data)
      # print("property metrics done calculating\n", property_metrics_data)

     
      rent_rolls = output5_data.get('rent_roll', [])
      rent_roll_totals = output5_data.get('totals', {})

      consolidated_data = {
          'property_summary': property_summary_data,
          'financing_assumptions': financing_assumptions_data,
          'income_statement_summary': income_statement_summary_data,
          'property_metrics': property_metrics_data,
          'output2': output2_data,
          'output3': output3_data,
          'output5_rentroll': rent_rolls,
          'output5_total': rent_roll_totals
      }
      
      current_app.logger.info(f"All calculations for {property_id} completed successfully.")
      current_app.logger.info("consolidated_data: ", consolidated_data);
      current_app.logger.info("Exiting flask server.");
      return jsonify(consolidated_data)
    
    except Exception as e:
        db.session.rollback() # Rollback the session on any error
        current_app.logger.error(f"Error during calculation process for {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to complete all calculations.", "details": str(e)}), 500
    
  
def get_all_property_data(property_id: str, firebase_uid: str):
    """
    Fetches all base input data required for all calculations.
    It does not fetch calculated tables like Output3.
    """
    try:
        data = {}
        print("data retrieving started")
        with db.session() as session:
            data['property'] = session.query(Property).filter_by(id=property_id, firebase_uid=firebase_uid).first()
            data['financial_chars'] = session.query(PropertyFinancialsAndCharacteristic).filter_by(property_id=property_id).first()
            data['operating_data'] = session.query(OperatingAssumptions).filter_by(property_id=property_id).first()
            data['financial_assumptions'] = session.query(FinancialAssumption).filter_by(property_id=property_id).first()
            data['acq_costs'] = session.query(FinancialAcquisitionCost).filter_by(property_id=property_id).first()
            data['cashflow_inputs'] = session.query(CashFlowInputs).filter_by(property_id=property_id).all()
            data['tenant_profile_yearly'] = session.query(TenantProfileYearly).filter_by(property_id=property_id).all()
            data['cashflow_projection_yearly'] = session.query(CashFlowProjectionYearly).filter_by(property_id=property_id).all()
            data['units'] = session.query(Units).filter_by(property_id=property_id).all()
        print("data retrieving ended")
        return data
    except Exception as e:
        db.session.rollback()
        raise e