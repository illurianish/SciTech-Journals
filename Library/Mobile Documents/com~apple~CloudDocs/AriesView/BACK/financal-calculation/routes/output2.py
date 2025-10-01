# Full financial model computation and detailed output for HILAND OFFICE

import numpy as np
import pandas as pd
from flask import Blueprint, request, jsonify, current_app
from flasgger import swag_from
from firebase_admin import auth
from flask_cors import cross_origin
from decimal import Decimal, InvalidOperation
# from routes.projection_utils import convert_flat_json_to_transposed

from models import (
    db, Property, OperatingAssumptions, CashFlowInputs, 
    CashFlowProjectionYearly, TenantProfileYearly,
    PropertyFinancialsAndCharacteristic, Output2
)

output2_bp = Blueprint('output2', __name__)

# @output2_bp.route('/output2_swagger', methods=['POST'])
# @swag_from({
#     'parameters': [{
#         'name': 'body',
#         'in': 'body',
#         'required': True,
#         'schema': {
#             'type': 'object',
#             'properties': {
#                 # Base Rent values for different periods
#                 'base_rent_y0': {'type': 'number', 'description': 'Base rent for Year 0'},
#                 'base_rent_t12': {'type': 'number', 'description': 'Base rent for T12'},
#                 'base_rent_pf': {'type': 'number', 'description': 'Base rent for Pro Forma'},
                
#                 # Recovery Income values for different periods
#                 'recovery_income_y0': {'type': 'number', 'description': 'Recovery income for Year 0'},
#                 'recovery_income_t12': {'type': 'number', 'description': 'Recovery income for T12'},
#                 'recovery_income_pf': {'type': 'number', 'description': 'Recovery income for Pro Forma'},
                
#                 # Other Income values for different periods
#                 'other_income_y0': {'type': 'number', 'description': 'Other income for Year 0'},
#                 'other_income_t12': {'type': 'number', 'description': 'Other income for T12'},
#                 'other_income_pf': {'type': 'number', 'description': 'Other income for Pro Forma'},
                
#                 # Rent Abatement values for different periods
#                 'rent_abatement_y0': {'type': 'number', 'description': 'Rent abatement for Year 0'},
#                 'rent_abatement_t12': {'type': 'number', 'description': 'Rent abatement for T12'},
#                 'rent_abatement_pf': {'type': 'number', 'description': 'Rent abatement for Pro Forma'},
                
#                 # Other Adjustments values for different periods
#                 'other_adjustments_y0': {'type': 'number', 'description': 'Other adjustments for Year 0'},
#                 'other_adjustments_t12': {'type': 'number', 'description': 'Other adjustments for T12'},
#                 'other_adjustments_pf': {'type': 'number', 'description': 'Other adjustments for Pro Forma'},
                
#                 # Vacancy Rate
#                 'vacancy_rate': {'type': 'number', 'description': 'Vacancy rate as decimal (e.g., 0.10 for 10%)'},
                
#                 # Net Rentable Area
#                 'net_rentable_area': {'type': 'number', 'description': 'Net rentable area in square feet'},
                
#                 # Additional parameters for backward compatibility
#                 'rent_income_pf': {'type': 'number'},
#                 'rent_income_growth_schedule': {'type': 'array', 'items': {'type': 'number'}},
#                 'vacancy_schedule': {'type': 'array', 'items': {'type': 'number'}},
#                 'opex_growth_schedule': {'type': 'array', 'items': {'type': 'number'}},
#                 'capex_growth_schedule': {'type': 'array', 'items': {'type': 'number'}},
#                 'expenses': {'type': 'object'},
#                 'capex': {'type': 'object'},
#                 'capital_reserves_pf': {'type': 'number'}
#             }
#         }
#     }],
#     'responses': {
#         200: {
#             'description': 'Income Statement Summary with Per SF Calculations',
#             'examples': {
#                 'application/json': {
#                     'summary': {
                        
#                     }
#                 }
#             }
#         }
#     }
# })
# def output2_swagger():
#     return jsonify({"message": "This is a swagger endpoint placeholder"})


# @output2_bp.route('/output2/<string:property_id>', methods=['OPTIONS'])
# @cross_origin()
# def handle_options_request(property_id):
#     """
#     Handles the preflight OPTIONS request for the income statement summary endpoint.
#     """
#     # Simply return a 200 OK response.
#     # The flask-cors global configuration will add the necessary CORS headers.
#     return jsonify({}), 200

# Outputs AJ to AM
@output2_bp.route('/output2/<string:property_id>', methods=['POST'])
@cross_origin()
@swag_from({
    'tags': ['Output 2'],
    'description': 'This endpoint calculates a complete income statement summary and real estate proforma for a given property_id. It expects a Firebase authentication token in the request body, which will be verified to ensure property ownership.',
    'parameters': [
        {
            'name': 'property_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The UUID of the property to calculate the income statement for.'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'idToken': {
                        'type': 'string',
                        'description': 'The Firebase authentication ID token (JWT) of the logged-in user.'
                    }
                }
            }
        }
    ],
    'definitions': {
        'IncomeStatementSummary': {
            'type': 'object',
            'properties': {
                'Base Rent Y0': {'type': 'number'},
                'Base Rent T12': {'type': 'number'},
                'Base Rent PF': {'type': 'number'},
                'Base Rent PSF PF': {'type': 'number'},
                'Recovery Income Y0': {'type': 'number'},
                'Recovery Income T12': {'type': 'number'},
                'Recovery Income PF': {'type': 'number'},
                'Recovery Income PSF PF': {'type': 'number'},
                'Other Income Y0': {'type': 'number'},
                'Other Income T12': {'type': 'number'},
                'Other Income PF': {'type': 'number'},
                'Other Income PSF PF': {'type': 'number'},
                'PGI Y0': {'type': 'number'},
                'PGI T12': {'type': 'number'},
                'PGI PF': {'type': 'number'},
                'PGI PSF PF': {'type': 'number'},
                'Rent Abatement Y0': {'type': 'number'},
                'Rent Abatement T12': {'type': 'number'},
                'Rent Abatement PF': {'type': 'number'},
                'Rent Abatement PSF PF': {'type': 'number'},
                'Vacancy Y0': {'type': 'number'},
                'Vacancy T12': {'type': 'number'},
                'Vacancy PF': {'type': 'number'},
                'Vacancy PSF PF': {'type': 'number'},
                'Other Adjustments Y0': {'type': 'number'},
                'Other Adjustments T12': {'type': 'number'},
                'Other Adjustments PF': {'type': 'number'},
                'Other Adjustments PSF PF': {'type': 'number'},
                'EGR Y0': {'type': 'number'},
                'EGR T12': {'type': 'number'},
                'EGR PF': {'type': 'number'},
                'EGR PSF PF': {'type': 'number'},
                'Net Rentable Area': {'type': 'number'},
                'Vacancy Rate': {'type': 'number'},
                'Marketing Y0': {'type': 'number'},
                'Marketing T12': {'type': 'number'},
                'Marketing PF': {'type': 'number'},
                'Marketing PSF PF': {'type': 'number'},
                'Administrative Y0': {'type': 'number'},
                'Administrative T12': {'type': 'number'},
                'Administrative PF': {'type': 'number'},
                'Administrative PSF PF': {'type': 'number'},
                'Utilities Y0': {'type': 'number'},
                'Utilities T12': {'type': 'number'},
                'Utilities PF': {'type': 'number'},
                'Utilities PSF PF': {'type': 'number'},
                'Payroll Y0': {'type': 'number'},
                'Payroll T12': {'type': 'number'},
                'Payroll PF': {'type': 'number'},
                'Payroll PSF PF': {'type': 'number'},
                'Maintenance Y0': {'type': 'number'},
                'Maintenance T12': {'type': 'number'},
                'Maintenance PF': {'type': 'number'},
                'Maintenance PSF PF': {'type': 'number'},
                'Mgmt Fee Y0': {'type': 'number'},
                'Mgmt Fee T12': {'type': 'number'},
                'Mgmt Fee PF': {'type': 'number'},
                'Mgmt Fee PSF PF': {'type': 'number'},
                'Mgmt Fee %': {'type': 'number'},
                'Insurance Y0': {'type': 'number'},
                'Insurance T12': {'type': 'number'},
                'Insurance PF': {'type': 'number'},
                'Insurance PSF PF': {'type': 'number'},
                'Taxes Y0': {'type': 'number'},
                'Taxes T12': {'type': 'number'},
                'Taxes PF': {'type': 'number'},
                'Taxes PSF PF': {'type': 'number'},
                'Opex Y0': {'type': 'number'},
                'Opex T12': {'type': 'number'},
                'Opex PF': {'type': 'number'},
                'Opex PSF PF': {'type': 'number'},
                'Net Operating Income Y0': {'type': 'number'},
                'Net Operating Income T12': {'type': 'number'},
                'Net Operating Income PF': {'type': 'number'},
                'Net Operating Income PSF PF': {'type': 'number'},
                'Tenant Improvement Y0': {'type': 'number'},
                'Tenant Improvement T12': {'type': 'number'},
                'Tenant Improvement PF': {'type': 'number'},
                'Tenant Improvement PSF PF': {'type': 'number'},
                'Leasing Commissions Y0': {'type': 'number'},
                'Leasing Commissions T12': {'type': 'number'},
                'Leasing Commissions PF': {'type': 'number'},
                'Leasing Commissions PSF PF': {'type': 'number'},
                'Capital Reserves Y0': {'type': 'number'},
                'Capital Reserves T12': {'type': 'number'},
                'Capital Reserves PF': {'type': 'number'},
                'Capital Reserves PSF PF': {'type': 'number'},
                'Misc Capex Y0': {'type': 'number'},
                'Misc Capex T12': {'type': 'number'},
                'Misc Capex PF': {'type': 'number'},
                'Misc Capex PSF PF': {'type': 'number'},
                'Capital Expenditures Y0': {'type': 'number'},
                'Capital Expenditures T12': {'type': 'number'},
                'Capital Expenditures PF': {'type': 'number'},
                'Capital Expenditures PSF PF': {'type': 'number'},
                'Cash Flow from Operations Y0': {'type': 'number'},
                'Cash Flow from Operations T12': {'type': 'number'},
                'Cash Flow from Operations PF': {'type': 'number'},
                'Cash Flow from Operations PSF PF': {'type': 'number'},
                'Rent PSF PF': {'type': 'number'},
                'Expenses PSF Y0': {'type': 'number'},
                'Expenses PSF T12': {'type': 'number'},
                'Expenses PSF PF': {'type': 'number'},
                'Expense Recovery % Y0': {'type': 'number'},
                'Expense Recovery % T12': {'type': 'number'},
                'Expense Recovery % PF': {'type': 'number'},
                'Expense Ratio Y0': {'type': 'number'},
                'Expense Ratio T12': {'type': 'number'},
                'Expense Ratio PF': {'type': 'number'},
                'CapEx as % of NOI Y0': {'type': 'number'},
                'CapEx as % of NOI T12': {'type': 'number'},
                'CapEx as % of NOI PF': {'type': 'number'},
                'Taxes as % of NOI Y0': {'type': 'number'},
                'Taxes as % of NOI T12': {'type': 'number'},
                'Taxes as % of NOI PF': {'type': 'number'},
                'projections': {
                    'type': 'object',
                    'description': 'Detailed yearly financial projections (Year 1 to 11).',
                    'properties': {
                        'Base Rent': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Recovery Income': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Other Income': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'PGI': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Rent Abatement': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Vacancy': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'EGR': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Marketing': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Administrative': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Utilities': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Payroll': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Repair and Maintenance': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Mgmt Fee': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Insurance': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Taxes': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Operating Expenses': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'NOI': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Tenant Improvements': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Leasing Commissions': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Capital Reserves': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Misc. CapEx': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Capital Expenditures': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'CFO': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Rent PSF': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Expenses PSF': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Expense Recovery %': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'Expense Ratio': {'type': 'object', 'additionalProperties': {'type': 'number'}},
                        'CapEx as % of NOI': {'type': 'object', 'additionalProperties': {'type': 'number'}}
                    }
                }
            }
        }
    },
    'responses': {
        200: {
            'description': 'Complete income statement summary with calculations.',
            'schema': {
                '$ref': '#/definitions/IncomeStatementSummary'
            }
        },
        400: {
            'description': 'Bad request (e.g., idToken missing from body).'
        },
        401: {
            'description': 'Invalid or expired authentication token.'
        },
        404: {
            'description': 'Property not found or access denied.'
        },
        500: {
            'description': 'Internal server error during data retrieval or calculation.'
        }
    }
})
def output2_endpoint(property_id):
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
    
    output2 = calculate_output2(property_id, firebase_uid)
    return output2

def calculate_output2(property_id, firebase_uid):
    
    try:
        
        # INPUT: retrieve input tables from database
        prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
        if not prop_data:
            current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
            return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
        else:
            current_app.logger.info(f"Successfully retrieved properties database {property_id}. properties: {prop_data}")
        
        cashflow_inputs = CashFlowInputs.query.filter_by(property_id=property_id).first()
        if not cashflow_inputs:
            current_app.logger.warning(f"No cash flow inputs found for property_id: {property_id}")
            return jsonify({"error": f"No cash flow inputs found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved cashflow_inputs database {property_id}. cashflow_inputs: {cashflow_inputs}")
        
        cashflow_projection_yearly = CashFlowProjectionYearly.query.filter_by(property_id=property_id).first()
        if not cashflow_projection_yearly:
            current_app.logger.warning(f"No yearly cash flow projections found for property_id: {property_id}")
            return jsonify({"error": f"No yearly cash flow projections found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved cashflow_projection_yearly database {property_id}. cashflow_projection_yearly: {cashflow_projection_yearly}")
        
        tenant_profile_yearly = TenantProfileYearly.query.filter_by(property_id=property_id).first()
        if not tenant_profile_yearly:
            current_app.logger.warning(f"No tenant profile yearly found for property_id: {property_id}")
            return jsonify({"error": f"No tenant profile yearly found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved tenant_profile_yearly database {property_id}. tenant_profile_yearly: {tenant_profile_yearly}")
        
        financial_chars = PropertyFinancialsAndCharacteristic.query.filter_by(property_id=property_id).first()
        if not financial_chars:
            current_app.logger.warning(f"No property financials/characteristics found for property_id: {property_id}")
            return jsonify({"error": f"No property financials/characteristics found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved financial_characteristics database {property_id}. financial_characteristics: {financial_chars}")

        # Cash Flow Table Helper Functions
        def get_cashflow_year0_value(category):
            value_entry = CashFlowInputs.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing CashFlowInput data for property {property_id} and category '{category}'.")
                return Decimal('0.0') 
            return value_entry.year_0
        
        def get_cashflow_t12_value(category):
            value_entry = CashFlowInputs.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing CashFlowInput data for property {property_id} and category '{category}'.")
                return Decimal('0.0') 
            return value_entry.t12
        
        def get_cashflow_proforma_value(category):
            value_entry = CashFlowInputs.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing CashFlowInput data for property {property_id} and category '{category}'.")
                return Decimal('0.0') 
            return value_entry.pro_forma
        
         # Tenant Profile Yearly Table Helper Functions 
        def get_tenant_year0_value(category):
            value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
                return Decimal('0.0')  
            return value_entry.year_0
        
        def get_tenant_t12_value(category):
            value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
                return Decimal('0.0')  
            return value_entry.t12
        
        def get_tenant_proforma_value(category):
            value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
                return Decimal('0.0')  
            return value_entry.pro_forma
        
        # INPUT: Net rentable area
        net_rentable_area = prop_data.square_footage  # square_footage, properties
        if not net_rentable_area:
            current_app.logger.warning(f"Property {property_id} is missing square footage data.")
            return jsonify({"error": "Property is missing square footage data."}), 404
        
        # INPUT: Cash flows (base rent, recovery income, other income)
        base_rent_y0 = get_cashflow_year0_value('Base Rent ($)') # user_inputs.get('base_rent_y0', 0) # category=Base Rent ($) + year_0, cash_flow_inputs
        base_rent_t12 = get_cashflow_t12_value('Base Rent ($)') # category=Base Rent ($) + t12, cash_flow_inputs
        base_rent_pf = get_cashflow_proforma_value('Base Rent ($)') # category=Base Rent ($) + pro_forma, cash_flow_inputs

        recovery_income_y0 = get_cashflow_year0_value('Recovery Income ($)') # user_inputs.get('recovery_income_y0', 0) # category=Recovery Income ($) + year_0, cash_flow_inputs
        recovery_income_t12 = get_cashflow_t12_value('Recovery Income ($)') # user_inputs.get('recovery_income_t12', 0) # category=Recovery Income ($) + t12, cash_flow_inputs
        recovery_income_pf = get_cashflow_proforma_value('Recovery Income ($)') # user_inputs.get('recovery_income_pf', 0) # category=Recovery Income ($) + pro_forma, cash_flow_inputs
    
        other_income_y0 = get_cashflow_year0_value('Other Income ($)') # user_inputs.get('other_income_y0', 0) # category=Other Income ($) + year_0, cash_flow_inputs
        other_income_t12 = get_cashflow_t12_value('Other Income ($)') # user_inputs.get('other_income_t12', 0) # category=Other Income ($) + t12, cash_flow_inputs
        other_income_pf = get_cashflow_proforma_value('Other Income ($)') # user_inputs.get('other_income_pf', 0) # category=Other Income ($) + pro_forma, cash_flow_inputs

    
        # INTERMEDIATE: Calculate per SF values
        base_rent_psf_pf = base_rent_pf / net_rentable_area if net_rentable_area > 0 else 0
        recovery_income_psf_pf = recovery_income_pf / net_rentable_area if net_rentable_area > 0 else 0
        other_income_psf_pf = other_income_pf / net_rentable_area if net_rentable_area > 0 else 0
        

        # INTERMEDIATE: Calculate PGI (Potential Gross Income) for each period
        pgi_y0 = base_rent_y0 + recovery_income_y0 + other_income_y0
        pgi_t12 = base_rent_t12 + recovery_income_t12 + other_income_t12
        pgi_pf = base_rent_pf + recovery_income_pf + other_income_pf
        pgi_psf_pf = base_rent_psf_pf + recovery_income_psf_pf + other_income_psf_pf
    
    
        # INPUT: Rent Abatement values
        rent_abatement_y0 = get_cashflow_year0_value('Rent Abatement ($)') # user_inputs.get('rent_abatement_y0', 0) # category=Rent Abatement ($) + year_0, cash_flow_inputs
        rent_abatement_t12 = get_cashflow_t12_value('Rent Abatement ($)') # user_inputs.get('rent_abatement_t12', 0)  # category=Rent Abatement ($) + t12, cash_flow_inputs
        rent_abatement_pf = get_cashflow_proforma_value('Rent Abatement ($)') # user_inputs.get('rent_abatement_pf', 0)  # category=Rent Abatement ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: Calculate rent abatement
        rent_abatement_psf_pf = rent_abatement_pf / net_rentable_area if net_rentable_area > 0 else 0
        
        # INPUT
        operating_data = OperatingAssumptions.query.filter_by(property_id=property_id).first()
        if not operating_data:
            current_app.logger.warning(f"No operating assumptions for {property_id} or access denied.")
            return jsonify({"error": f"Operating Assumptions with ID: {property_id} not found or access denied."}), 404
        
        vacancy_rate_whole_numbers = operating_data.vacancy_rate # user_inputs.get('vacancy_rate', 0) # vacancy_rate, financial_operating_assumptions
        vacancy_rate = Decimal(str(vacancy_rate_whole_numbers)) / 100 if vacancy_rate_whole_numbers is not None else Decimal('0.0')

        # INTERMEDIATE
        vacancy_y0 = (pgi_y0 * vacancy_rate) # -(pgi_y0 * vacancy_rate)
        vacancy_t12 = (pgi_t12 * vacancy_rate)# -(pgi_t12 * vacancy_rate)
        vacancy_pf = (pgi_pf * vacancy_rate)    # -(pgi_pf * vacancy_rate)    
        vacancy_psf_pf = vacancy_pf / net_rentable_area if net_rentable_area > 0 else 0
    
        # INPUT: Other Adjustments values
        other_adjustments_y0 = get_tenant_year0_value('Other Adjustments ($)') #  user_inputs.get('other_adjustments_y0', 0) # category=Other Adjustments ($) + year_0, tenant_profile_yearly
        other_adjustments_t12 = get_tenant_t12_value('Other Adjustments ($)') # user_inputs.get('other_adjustments_t12', 0) # category=Other Adjustments ($) + t12, tenant_profile_yearly
        other_adjustments_pf = get_tenant_proforma_value('Other Adjustments ($)') # user_inputs.get('other_adjustments_pf', 0) # category=Other Adjustments ($) + pro_forma, tenant_profile_yearly
        
        # INTERMEDIATE: other adjustments
        other_adjustments_psf_pf = other_adjustments_pf / net_rentable_area if net_rentable_area > 0 else 0
   
        # INTERMEDIATE: Calculate Effective Gross Revenue (EGR)
        egr_y0 = pgi_y0 - rent_abatement_y0 - vacancy_y0 + other_adjustments_y0 # rent_abatement and vacancy are subtracted from potential gross income
        egr_t12 = pgi_t12 - rent_abatement_t12 - vacancy_t12 + other_adjustments_t12
        egr_pf = pgi_pf - rent_abatement_pf - vacancy_pf + other_adjustments_pf
        egr_psf_pf = pgi_psf_pf - rent_abatement_psf_pf - vacancy_psf_pf + other_adjustments_psf_pf

        # INPUT: Marketing
        marketing_y0 = get_cashflow_year0_value('Marketing ($)') # user_inputs.get('marketing_y0', 0) # category=Marketing ($) + year_0, cash_flow_inputs
        marketing_t12 = get_cashflow_t12_value('Marketing ($)') # user_inputs.get('marketing_t12', 0) # category=Marketing ($) + t12, cash_flow_inputs
        marketing_pf = get_cashflow_proforma_value('Marketing ($)')# user_inputs.get('marketing_pf', 0) # category=Marketing ($) + pro_forma, cash_flow_inputs
       
        # INTERMEDIATE: administrative 
        marketing_psf_pf = marketing_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: Administrative
        administrative_y0 = get_cashflow_year0_value('Administrative ($)') # user_inputs.get('administrative_y0', 0) # category=Administrative ($) + year_0, cash_flow_inputs
        administrative_t12 = get_cashflow_t12_value('Administrative ($)') # user_inputs.get('administrative_t12', 0) # category=Administrative ($) + t12, cash_flow_inputs
        administrative_pf = get_cashflow_proforma_value('Administrative ($)') # user_inputs.get('administrative_pf', 0) # category=Administrative ($) + pro_forma, cash_flow_inputs
    
        # INTERMEDIATE: administrative
        administrative_psf_pf = administrative_pf / net_rentable_area if net_rentable_area > 0 else 0    
    
        # INPUT: utilities
        utilities_y0 = get_cashflow_year0_value('Utilities ($)') # user_inputs.get('utilities_y0', 0) # category=Utilities ($) + year_0, cash_flow_inputs
        utilities_t12 = get_cashflow_t12_value('Utilities ($)')  # user_inputs.get('utilities_t12', 0) # category=Utilities ($) + t12, cash_flow_inputs
        utilities_pf = get_cashflow_proforma_value('Utilities ($)') # user_inputs.get('utilities_pf', 0) # category=Utilities ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: utilities
        utilities_psf_pf = utilities_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: payroll
        payroll_y0 = get_cashflow_year0_value('Payroll ($)') # user_inputs.get('payroll_y0', 0) # category=Payroll ($) + year_0, cash_flow_inputs
        payroll_t12 = get_cashflow_t12_value('Payroll ($)') # user_inputs.get('payroll_t12', 0) # category=Payroll ($) + t12, cash_flow_inputs
        payroll_pf = get_cashflow_proforma_value('Payroll ($)') # user_inputs.get('payroll_pf', 0) # category=Payroll ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: payroll
        payroll_psf_pf = payroll_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: maintenance
        maintenance_y0 = get_cashflow_year0_value('Repair & Maintenance ($)') # user_inputs.get('maintenance_y0', 0) # category=Repair & Maintenance ($) + year_0, cash_flow_inputs
        maintenance_t12 = get_cashflow_t12_value('Repair & Maintenance ($)') # user_inputs.get('maintenance_t12', 0) # category=Repair & Maintenance ($) + t12, cash_flow_inputs
        maintenance_pf = get_cashflow_proforma_value('Repair & Maintenance ($)') # user_inputs.get('maintenance_pf', 0) # category=Repair & Maintenance ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: maintenance
        maintenance_psf_pf = maintenance_pf / net_rentable_area if net_rentable_area > 0 else 0
        
        # INPUT: management fee
        mgmt_fee = operating_data.management_fee / 100 # user_inputs.get('mgmt_fee', 0) # managament fee, operating assumptions
    
        # INTERMEDIATE: management fee
        mgmt_fee_y0 = egr_y0 * mgmt_fee
        mgmt_fee_t12     = egr_t12 * mgmt_fee
        mgmt_fee_pf = egr_pf * mgmt_fee
        mgmt_fee_psf_pf = mgmt_fee_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: insurance
        insurance_y0 = get_cashflow_year0_value('Insurance ($)') # user_inputs.get('insurance_y0', 0) # category=Insurance ($) + year_0, cash_flow_inputs
        insurance_t12 = get_cashflow_t12_value('Insurance ($)') # user_inputs.get('insurance_t12', 0) # category=Insurance ($) + t12, cash_flow_inputs
        insurance_pf = get_cashflow_proforma_value('Insurance ($)') # user_inputs.get('insurance_pf', 0) # category=Insurance ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: insurance
        insurance_psf_pf = insurance_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: taxes
        taxes_y0 = get_cashflow_year0_value('Taxes ($)') # user_inputs.get('taxes_y0', 0) # category=Taxes ($) + year_0, cash_flow_inputs
        taxes_t12 = get_cashflow_t12_value('Taxes ($)') # user_inputs.get('taxes_t12', 0) # category=Taxes ($) + t12, cash_flow_inputs
        taxes_pf = get_cashflow_proforma_value('Taxes ($)') # user_inputs.get('taxes_pf', 0) # category=Taxes ($) + pro_forma, cash_flow_inputs
        
        # INTERMEDIATE: taxes
        taxes_psf_pf = taxes_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INTERMEDIATE: opex
        opex_y0 = marketing_y0 + administrative_y0 + utilities_y0 + maintenance_y0 + insurance_y0 + taxes_y0 + mgmt_fee_y0 + payroll_y0
        opex_t12 = marketing_t12 + administrative_t12 + utilities_t12 + maintenance_t12 + insurance_t12 + taxes_t12 + mgmt_fee_t12 + payroll_t12
        opex_pf = marketing_pf + administrative_pf + utilities_pf + maintenance_pf + insurance_pf + taxes_pf + mgmt_fee_pf + payroll_pf
        opex_psf_pf = opex_pf / net_rentable_area if net_rentable_area > 0 else 0
    
        # INTERMEDIATE: Net Operating Income
        net_operating_income_y0 = egr_y0 - opex_y0
        net_operating_income_t12 = egr_t12 - opex_t12
        net_operating_income_pf = egr_pf - opex_pf
        net_operating_income_psf_pf = egr_psf_pf - opex_psf_pf
        
        # INPUT: tenant improvements
        tenant_improvement_y0 = get_tenant_year0_value('Tenant Improvements ($)')# user_inputs.get('tenant_improvement_y0', 0) # category=Tenant Improvements ($) + year_0, tenant_profile_yearly
        tenant_improvement_t12 = get_tenant_t12_value('Tenant Improvements ($)') # user_inputs.get('tenant_improvement_t12', 0) # category=Tenant Improvements ($) + t12, tenant_profile_yearly
        tenant_improvement_pf = get_tenant_proforma_value('Tenant Improvements ($)') # user_inputs.get('tenant_improvement_pf', 0) # category=Tenant Improvements ($) + pro_forma, tenant_profile_yearly
        
        # INTERMEDIATE: tenant improvements
        tenant_improvement_psf_pf = tenant_improvement_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: leasing commissions
        lease_commissions_y0 = get_tenant_year0_value('Leasing Commissions ($)')# user_inputs.get('lease_commissions_y0', 0) # category=Leasing Commissions ($) + year_0, tenant_profile_yearly
        lease_commissions_t12 = get_tenant_t12_value('Leasing Commissions ($)') # user_inputs.get('lease_commissions_t12', 0) # category=Leasing Commissions ($) + t12, tenant_profile_yearly
        lease_commissions_pf = get_tenant_proforma_value('Leasing Commissions ($)') # user_inputs.get('lease_commissions_pf', 0) # category=Leasing Commissions ($) + pro_forma, tenant_profile_yearly
        
        # INTERMEDIATE: leasing commissions
        lease_commissions_psf_pf = lease_commissions_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: capital reserves
        capital_reserves_y0 = get_tenant_year0_value('CapEx Reserves ($)') # user_inputs.get('capital_reserves_y0', 0) # category=CapEx Reserves ($) + year_0, tenant_profile_yearly
        capital_reserves_t12 = get_tenant_t12_value('CapEx Reserves ($)') # user_inputs.get('capital_reserves_t12', 0) # category=CapEx Reserves ($) + t12, tenant_profile_yearly
        capital_reserves_pf = get_tenant_proforma_value('CapEx Reserves ($)')# user_inputs.get('capital_reserves_pf', 0) # category=CapEx Reserves ($) + pro_forma, tenant_profile_yearly
    
        # INTERMEDIATE: capital reserves
        capital_reserves_psf_pf = capital_reserves_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INPUT: misc capex
        misc_capex_y0 = get_tenant_year0_value('Misc. CapEx ($)') # user_inputs.get('misc_capex_y0', 0) # category=Misc. CapEx ($) + year_0, tenant_profile_yearly
        misc_capex_t12 = get_tenant_t12_value('Misc. CapEx ($)') # user_inputs.get('misc_capex_t12', 0) # category=Misc. CapEx ($) + t12, tenant_profile_yearly
        misc_capex_pf = get_tenant_proforma_value('Misc. CapEx ($)') # user_inputs.get('misc_capex_pf', 0) # category=Misc. CapEx ($) + pro_forma, tenant_profile_yearly
        
        # INTERMEDIATE: misc capex
        misc_capex_psf_pf = misc_capex_pf / net_rentable_area if net_rentable_area > 0 else 0

        # INTERMEDIATE: capital expenditures
        capital_expenditures_y0 = tenant_improvement_y0 + lease_commissions_y0 + capital_reserves_y0 + misc_capex_y0
        capital_expenditures_t12 = tenant_improvement_t12 + lease_commissions_t12 + capital_reserves_t12 + misc_capex_t12
        capital_expenditures_pf = tenant_improvement_pf + lease_commissions_pf + capital_reserves_pf + misc_capex_pf
        capital_expenditures_psf_pf = tenant_improvement_psf_pf + lease_commissions_psf_pf + capital_reserves_psf_pf + misc_capex_psf_pf

        cash_flow_from_operations_y0 = net_operating_income_y0 - capital_expenditures_y0
        cash_flow_from_operations_t12 = net_operating_income_t12 - capital_expenditures_t12
        cash_flow_from_operations_pf = net_operating_income_pf - capital_expenditures_pf
        cash_flow_from_operations_psf_pf = net_operating_income_psf_pf - capital_expenditures_psf_pf    

        # INTERMEDIATE: Operating metrics
        rent_psf_y0 = base_rent_y0 / net_rentable_area if net_rentable_area > 0 else 0
        rent_psf_t12 = base_rent_t12 / net_rentable_area if net_rentable_area > 0 else 0
        rent_psf_pf = base_rent_pf / net_rentable_area if net_rentable_area > 0 else 0

        expense_psf_y0 = opex_y0 / net_rentable_area if net_rentable_area > 0 else 0
        expense_psf_t12 = opex_t12 / net_rentable_area if net_rentable_area > 0 else 0
        expense_psf_pf = opex_pf / net_rentable_area if net_rentable_area > 0 else 0

        expense_recovery_pct_y0 = (recovery_income_y0 / opex_y0) * 100
        expense_recovery_pct_t12 = (recovery_income_t12 / opex_t12) * 100
        expense_recovery_pct_pf = (recovery_income_pf / opex_pf) * 100

        expense_ratio_y0 = (opex_y0 / egr_y0) * 100
        expense_ratio_t12 = (opex_t12 / egr_t12) * 100
        expense_ratio_pf = (opex_pf / egr_pf) * 100

        capex_noi_y0 = (capital_expenditures_y0 / net_operating_income_y0) * 100
        capex_noi_t12 = (capital_expenditures_t12 / net_operating_income_t12) * 100
        capex_noi_pf = (capital_expenditures_pf / net_operating_income_pf) * 100

        capex_egr_y0 = (capital_expenditures_y0 / egr_y0) * 100
        capex_egr_t12 = (capital_expenditures_t12 / egr_t12) * 100
        capex_egr_pf = (capital_expenditures_pf / egr_pf) * 100

        # INPUT: exit cap rate growth
        exit_cap_y1 = financial_chars.market_cap_rate / 100 # market_cap_rate, property_financials_and_characteristics
    
        gross_sales_price = net_operating_income_pf / exit_cap_y1 # user_inputs.get('gross_sales_price', 24508467) # purchase_price OR selling_cost_at_exit
        tax_mill_y0 = (taxes_y0 / gross_sales_price)*100
        tax_mill_t12 = (taxes_t12 / gross_sales_price)*100
        tax_mill_pf = (taxes_pf / gross_sales_price)*100
        
        # user_inputs["mgmt_fee_pf"]= mgmt_fee_pf
        
        calculated_inputs = {
            'Vacancy PF': vacancy_pf,
            'CapEx Reserves PF': capital_reserves_pf,
        }
        
        detailed_financials = calculate_detailed_financials(calculated_inputs, property_id, firebase_uid) 

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for income statement for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process income statement data for calculation.", "details": str(e)}), 500
      

    # Create summary response
    summary = { 
        'Base Rent Y0': base_rent_y0,
        'Base Rent T12': base_rent_t12,
        'Base Rent PF': base_rent_pf,
        'Base Rent PSF PF': round(base_rent_psf_pf, 2),
        'Recovery Income Y0': recovery_income_y0,
        'Recovery Income T12': recovery_income_t12,
        'Recovery Income PF': recovery_income_pf,
        'Recovery Income PSF PF': round(recovery_income_psf_pf, 2),
        'Other Income Y0': other_income_y0,
        'Other Income T12': other_income_t12,
        'Other Income PF': other_income_pf,
        'Other Income PSF PF': round(other_income_psf_pf, 2),
        'PGI Y0': pgi_y0,
        'PGI T12': pgi_t12,
        'PGI PF': pgi_pf,
        'PGI PSF PF': round(pgi_psf_pf, 2),
        'Rent Abatement Y0': rent_abatement_y0,
        'Rent Abatement T12': rent_abatement_t12,
        'Rent Abatement PF': rent_abatement_pf,
        'Rent Abatement PSF PF': round(rent_abatement_psf_pf, 2),
        'Vacancy Y0': vacancy_y0,
        'Vacancy T12': vacancy_t12,
        'Vacancy PF': vacancy_pf,
        'Vacancy PSF PF': round(vacancy_psf_pf, 2),
        'Other Adjustments Y0': other_adjustments_y0,
        'Other Adjustments T12': other_adjustments_t12,
        'Other Adjustments PF': other_adjustments_pf,
        'Other Adjustments PSF PF': round(other_adjustments_psf_pf, 2),
        'EGR Y0': round(egr_y0,2),
        'EGR T12': round(egr_t12,2),
        'EGR PF': round(egr_pf,2),
        'EGR PSF PF': round(egr_psf_pf, 2), 
        'Net Rentable Area': net_rentable_area,
        'Vacancy Rate': vacancy_rate,
        'Marketing Y0': marketing_y0,
        'Marketing T12': marketing_t12,
        'Marketing PF': marketing_pf,
        'Marketing PSF PF': round(marketing_psf_pf, 2),
        'Administrative Y0': administrative_y0,
        'Administrative T12': administrative_t12,
        'Administrative PF': administrative_pf,
        'Administrative PSF PF': round(administrative_psf_pf, 2),
        'Utilities Y0': utilities_y0,
        'Utilities T12': utilities_t12,
        'Utilities PF': utilities_pf,
        'Utilities PSF PF': round(utilities_psf_pf, 2),
        'Payroll Y0': payroll_y0,
        'Payroll T12': payroll_t12,
        'Payroll PF': payroll_pf,
        'Payroll PSF PF': round(payroll_psf_pf, 2),
        'Maintenance Y0': maintenance_y0,
        'Maintenance T12': maintenance_t12,
        'Maintenance PF': maintenance_pf,
        'Maintenance PSF PF': round(maintenance_psf_pf, 2),
        'Mgmt Fee Y0': round(mgmt_fee_y0,2),
        'Mgmt Fee T12': round(mgmt_fee_t12,2),
        'Mgmt Fee PF': round(mgmt_fee_pf,2),
        'Mgmt Fee PSF PF': round(mgmt_fee_psf_pf, 2),
        'Mgmt Fee %': mgmt_fee,
        'Insurance Y0': insurance_y0,
        'Insurance T12': insurance_t12,
        'Insurance PF': insurance_pf,
        'Insurance PSF PF': round(insurance_psf_pf, 2),
        'Taxes Y0': taxes_y0,
        'Taxes T12': taxes_t12,
        'Taxes PF': taxes_pf,
        'Taxes PSF PF': round(taxes_psf_pf, 2),
        'Opex Y0': round(opex_y0, 2),
        'Opex T12': round(opex_t12, 2),
        'Opex PF': round(opex_pf, 2),
        'Opex PSF PF': round(opex_psf_pf, 2),
        'Net Operating Income Y0': round(net_operating_income_y0, 2),
        'Net Operating Income T12': round(net_operating_income_t12, 2),
        'Net Operating Income PF': round(net_operating_income_pf, 2),
        'Net Operating Income PSF PF': round(net_operating_income_psf_pf, 2),
        'Tenant Improvement Y0': tenant_improvement_y0,
        'Tenant Improvement T12': tenant_improvement_t12,
        'Tenant Improvement PF': tenant_improvement_pf,
        'Tenant Improvement PSF PF': round(tenant_improvement_psf_pf, 2),
        'Leasing Commissions Y0': lease_commissions_y0,
        'Leasing Commissions T12': lease_commissions_t12,
        'Leasing Commissions PF': lease_commissions_pf,
        'Leasing Commissions PSF PF': round(lease_commissions_psf_pf, 2),
        'Capital Reserves Y0': round(capital_reserves_y0, 2),
        'Capital Reserves T12': round(capital_reserves_t12, 2),
        'Capital Reserves PF': round(capital_reserves_pf, 2),
        'Capital Reserves PSF PF': round(capital_reserves_psf_pf, 2),
        'Misc Capex Y0': round(misc_capex_y0, 2),
        'Misc Capex T12': round(misc_capex_t12, 2),
        'Misc Capex PF': round(misc_capex_pf, 2),
        'Misc Capex PSF PF': round(misc_capex_psf_pf, 2),
        'Capital Expenditures Y0': round(capital_expenditures_y0, 2),
        'Capital Expenditures T12': round(capital_expenditures_t12, 2),
        'Capital Expenditures PF': round(capital_expenditures_pf, 2),
        'Capital Expenditures PSF PF': round(capital_expenditures_psf_pf, 2),
        'CFO Y0': round(cash_flow_from_operations_y0, 2),
        'CFO T12': round(cash_flow_from_operations_t12, 2),
        'CFO PF': round(cash_flow_from_operations_pf, 2),
        'CFO PSF PF': round(cash_flow_from_operations_psf_pf, 2),
        'Rent PSF Y0': round(rent_psf_y0, 2),
        'Rent PSF T12': round(rent_psf_t12, 2),
        'Rent PSF PF': round(rent_psf_pf, 2),
        'Expenses PSF Y0': round(expense_psf_y0, 2),
        'Expenses PSF T12': round(expense_psf_t12, 2),
        'Expenses PSF PF': round(expense_psf_pf, 2),
        'Expense Recovery % Y0': round(expense_recovery_pct_y0, 2),
        'Expense Recovery % T12': round(expense_recovery_pct_t12, 2),
        'Expense Recovery % PF': round(expense_recovery_pct_pf, 2),
        'Expense Ratio Y0': round(expense_ratio_y0, 2),
        'Expense Ratio T12': round(expense_ratio_t12, 2),
        'Expense Ratio PF': round(expense_ratio_pf, 2),
        'CapEx as % of NOI Y0': round(capex_noi_y0, 2),
        'CapEx as % of NOI T12': round(capex_noi_t12, 2),
        'CapEx as % of NOI PF': round(capex_noi_pf, 2),
        'Taxes as % of NOI Y0': round(tax_mill_y0, 2),
        'Taxes as % of NOI T12': round(tax_mill_t12, 2),
        'Taxes as % of NOI PF': round(tax_mill_pf, 2),
        'projections': detailed_financials.to_dict(index=[f"Year {i+1}" for i in range(11)])
    }
    
    # Update / Post to the Output 2 Table in Database
    category_mapping = {
        "Administrative": "Administrative",
        "Base Rent": "Base Rent",
        "Capital Expenditures": "Capital Expenditures",
        "Capital Reserves": "Capital Reserves",
        "CapEx as % of NOI": "CapEx as % of NOI",
        "CFO": "CFO", # Mapped from the correct summary key
        "EGR": "EGR", # Mapped from the correct summary key
        "Expense Ratio": "Expense Ratio",
        "Expense Recovery %": "Expense Recovery %",
        "Expenses PSF": "Expenses PSF",
        "Insurance": "Insurance",
        "Leasing Commissions": "Leasing Commissions",
        "Marketing": "Marketing",
        "Mgmt Fee": "Mgmt Fee", # Mapped from the correct summary key
        "Misc Capex": "Misc Capex",
        "Net Operating Income": "Net Operating Income",
        "Opex": "Opex", # Mapped from the correct summary key
        "Other Income": "Other Income",
        "PGI": "PGI", # Mapped from the correct summary key
        "Payroll": "Payroll",
        "Recovery Income": "Recovery Income",
        "Rent Abatement": "Rent Abatement",
        "Rent PSF": "Rent PSF",
        "Maintenance": "Maintenance", # Correct key is "Maintenance"
        "Taxes": "Taxes",
        "Tenant Improvement": "Tenant Improvement", # Correct key is "Tenant Improvement"
        "Utilities": "Utilities",
        "Vacancy": "Vacancy",
        "Taxes as % of NOI": "Taxes as % of NOI"
    }

        
    # The keys in the main JSON object for T12, Y0, PF, and PSF PF
    json_keys = {
        'Y0': 'Y0',
        'T12': 'T12',
        'PF': 'PF',
        'PSF PF': 'PSF PF'
    }
    
    # Iterate through each category in our mapping
    for json_category, db_category in category_mapping.items():
        # Check if an entry for this specific category and property exists
        income_statement_entry = Output2.query.filter_by(property_id=property_id, category=db_category).first()

        # If the entry exists, update it. Otherwise, create a new one.
        if income_statement_entry:
            current_app.logger.info(f"Updating income statement entry for category: {db_category}")
        else:
            income_statement_entry = Output2(
                property_id=property_id,
                category=db_category
            )
            db.session.add(income_statement_entry)
            current_app.logger.info(f"Creating new income statement entry for category: {db_category}")

        t12_key = f"{json_category} {json_keys['T12']}"
        y0_key = f"{json_category} {json_keys['Y0']}"
        pf_key = f"{json_category} {json_keys['PF']}"
        psf_pf_key = f"{json_category} {json_keys['PSF PF']}"
        
        def to_decimal(value, default=None):
          if value is None:
            return default
          try:
            return Decimal(str(value))
          except InvalidOperation:
            return default
        
        # Populate the columns, checking if the key exists to avoid errors
        income_statement_entry.year_0 = to_decimal(summary.get(y0_key))
        income_statement_entry.t12 = to_decimal(summary.get(t12_key))
        income_statement_entry.pro_forma = to_decimal(summary.get(pf_key))
        income_statement_entry.psf_pro_forma = to_decimal(summary.get(psf_pf_key))
        
        # Handle the special cases for 'Mgmt Fee %', 'Vacancy Rate', etc.
        if json_category == "Mgmt Fee":
            income_statement_entry.pro_forma = to_decimal(summary.get('Mgmt Fee PF'))
        elif json_category == "Expense PSF":
            income_statement_entry.psf_pro_forma = to_decimal(summary.get('Expense PSF PF'))
        elif json_category == "Vacancy":
            income_statement_entry.pro_forma = to_decimal(summary.get('Vacancy PF'))

        # --- Populate yearly projection values from the nested 'projections' dictionary ---
        if 'projections' in summary and json_category in summary['projections']:
            projection_data = summary['projections'][json_category]
            
            # Loop through Year 1 to Year 11 and populate the corresponding database columns
            for i in range(1, 12):
                year_key = f"Year {i}"
                db_column_name = f"year_{i}" # e.g., year_1, year_2
                
                # Use setattr to dynamically set the column value
                if year_key in projection_data:
                    setattr(income_statement_entry, db_column_name, to_decimal(projection_data[year_key]))
                else:
                    # Set to None if the year data is missing
                    setattr(income_statement_entry, db_column_name, None)
        
    # Commit all changes to the database at once after the loop completes
    db.session.commit()
    current_app.logger.info(f"All Output 2 categories saved/updated for Property ID: {property_id}")
    
    return summary

# "projections" section above, Outputs AO to AY
def calculate_detailed_financials(calculated_inputs, property_id, firebase_uid):
    # This function is kept for backward compatibility
    # For now, we'll use the new calculation method
    
    prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
    if not prop_data:
        current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
        return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
    else:
        current_app.logger.info(f"Successfully retrieved properties database {property_id}. properties: {prop_data}")
    
    financial_chars = PropertyFinancialsAndCharacteristic.query.filter_by(property_id=property_id).first()
    if not financial_chars:
        current_app.logger.warning(f"No property financials/characteristics found for property_id: {property_id}")
        return jsonify({"error": f"No property financials/characteristics found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved financial_characteristics database {property_id}. financial_characteristics: {financial_chars}")

    cashflow_inputs = CashFlowInputs.query.filter_by(property_id=property_id).first()
    if not cashflow_inputs:
        current_app.logger.warning(f"No cash flow inputs found for property_id: {property_id}")
        return jsonify({"error": f"No cash flow inputs found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved cashflow_inputs database {property_id}. cashflow_inputs: {cashflow_inputs}")
    
    cashflow_projection_yearly = CashFlowProjectionYearly.query.filter_by(property_id=property_id).first()
    if not cashflow_projection_yearly:
        current_app.logger.warning(f"No yearly cash flow projections found for property_id: {property_id}")
        return jsonify({"error": f"No yearly cash flow projections found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved cashflow_projection_yearly database {property_id}. cashflow_projection_yearly: {cashflow_projection_yearly}")
    
    tenant_profile_yearly = TenantProfileYearly.query.filter_by(property_id=property_id).first()
    if not tenant_profile_yearly:
        current_app.logger.warning(f"No tenant profile yearly found for property_id: {property_id}")
        return jsonify({"error": f"No tenant profile yearly found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved tenant_profile_yearly database {property_id}. tenant_profile_yearly: {tenant_profile_yearly}")
    
        
    def get_cashflow_proforma_value(category):
            value_entry = CashFlowInputs.query.filter_by(property_id=property_id, category=category).first()
            if not value_entry:
                current_app.logger.warning(f"Missing CashFlowInput data for property {property_id} and category '{category}'.")
                return Decimal('0.0') 
            return value_entry.pro_forma
        
    
    def get_tenant_proforma_value(category):
        value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
        if not value_entry:
            current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
            return Decimal('0.0')  
        return value_entry.pro_forma
    
    def get_cashflow_yearly_values(category):
        value_entry = CashFlowProjectionYearly.query.filter_by(property_id=property_id, category=category).first()
        if not value_entry:
            current_app.logger.warning(f"Missing CashFlowProjectionYearly data for property {property_id} and category '{category}'.")
            return [Decimal('0.0')] * 11 

        yearly_values = [
            value_entry.year_1,
            value_entry.year_2,
            value_entry.year_3,
            value_entry.year_4,
            value_entry.year_5,
            value_entry.year_6,
            value_entry.year_7,
            value_entry.year_8,
            value_entry.year_9,
            value_entry.year_10,
            value_entry.year_11
        ]
        return yearly_values
    
    def get_tenant_yearly_values(category):
        value_entry = TenantProfileYearly.query.filter_by(property_id=property_id, category=category).first()
        if not value_entry:
            current_app.logger.warning(f"Missing TenantProfileYearly data for property {property_id} and category '{category}'.")
            return [Decimal('0.0')] * 11 

        yearly_values = [
            value_entry.year_1,
            value_entry.year_2,
            value_entry.year_3,
            value_entry.year_4,
            value_entry.year_5,
            value_entry.year_6,
            value_entry.year_7,
            value_entry.year_8,
            value_entry.year_9,
            value_entry.year_10,
            value_entry.year_11
        ]
        return yearly_values


    base_rent = [get_cashflow_proforma_value('Base Rent ($)')] # [user_inputs.get('base_rent_pf', 0)]
    recovery_income = [get_cashflow_proforma_value('Recovery Income ($)')] # [user_inputs.get('recovery_income_pf', 0)]
    other_income = [get_cashflow_proforma_value('Other Income ($)')] # [user_inputs.get('other_income_pf', 0)]
    # rent_income = [get_cashflow_proforma_value('Income Growth Rates')]# REMOVED: [user_inputs.get('rent_income_pf', 0)]

    growth_schedule_whole_numbers = get_cashflow_yearly_values('Income Growth Rates') # user_inputs.get('rent_income_growth_schedule', [0] * 11) # A69: takes all percentages from Year1-11
    growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in growth_schedule_whole_numbers]
    while len(growth_schedule) < 11:
        growth_schedule.append(0)

    for i in range(1, 11):
        growth = growth_schedule[i] if i < len(growth_schedule) else 0
        base_rent.append(base_rent[i - 1] * (1 + growth))
        recovery_income.append(recovery_income[i - 1] * (1 + growth))
        other_income.append(other_income[i - 1] * (1 + growth))
        # rent_income.append(rent_income[i - 1] * (1 + growth)) REMOVED

    print(f"Base rent list length: {len(base_rent)} contents: {base_rent}")
    print(f"Recovery income list length: {len(recovery_income)} contents: {recovery_income}")
    print(f"Other income list length: {len(other_income)} contents: {other_income}")
    # The following line will likely expose an IndexError if the lengths are not 11
    PGI = [base_rent[i] + recovery_income[i] + other_income[i] for i in range(11)] # + rent_income[i] REMOVED
    rent_abatement = [get_cashflow_proforma_value('Rent Abatement ($)')] + [0] * 10 # [user_inputs.get('rent_abatement_pf', 0)] + [0]*10

    vacancy_schedule_whole_numbers = get_cashflow_yearly_values('Vacancy Rates')# user_inputs.get('vacancy_schedule', [0] * 11) # A68: takes all percentages from Year1-11
    pro_forma_vacancy = calculated_inputs.get('Vacancy PF')
    vacancy_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in vacancy_schedule_whole_numbers]
    
    if vacancy_schedule is None:
        vacancy_schedule = [0] * 11

    while len(vacancy_schedule) < 11:
        vacancy_schedule.append(0)

    vacancy = [PGI[i] * Decimal(item) if item is not None else Decimal('0.0') for i, item in enumerate(vacancy_schedule)] # [PGI[i] * vacancy_schedule[i] for i in range(11)]
    vacancy[0] = pro_forma_vacancy # Overwrite the Year 1 Vacancy
    
    EGR = [PGI[i] - rent_abatement[i] - vacancy[i] for i in range(11)]

    # Standardized expense categories
    expenses = {
        "marketing": [get_cashflow_proforma_value('Marketing ($)')],# [user_inputs.get('marketing_pf', 0)],
        "administrative": [get_cashflow_proforma_value('Administrative ($)')], # [user_inputs.get('administrative_pf', 0)],
        "utilities": [get_cashflow_proforma_value('Utilities ($)')], # [user_inputs.get('utilities_pf', 0)],
        "payroll": [get_cashflow_proforma_value('Payroll ($)')],# [user_inputs.get('payroll_pf', 0)],
        "repair": [get_cashflow_proforma_value('Repair & Maintenance ($)')],# [user_inputs.get('maintenance_pf', 0)],
        "mgmt": [get_cashflow_proforma_value('Mgmt of EGR ($)')],# [user_inputs.get('mgmt_fee_pf', 0)],
        "insurance": [get_cashflow_proforma_value('Insurance ($)')],# [user_inputs.get('insurance_pf', 0)],
        "taxes": [get_cashflow_proforma_value('Taxes ($)')],# [user_inputs.get('taxes_pf', 0)]
    }

    opex_growth_schedule_whole_numbers = get_cashflow_yearly_values('Opex Growth Excluding Taxes Rates') # user_inputs.get('opex_growth_schedule', [0] * 11) # A70, from Year1-11
    opex_growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in opex_growth_schedule_whole_numbers]
    
    while len(opex_growth_schedule) < 11:
        opex_growth_schedule.append(0)

    for k in expenses:
        for i in range(1, 11):
            growth = opex_growth_schedule[i] if i < len(opex_growth_schedule) else 0
            expenses[k].append(expenses[k][i - 1] * (1 + growth))

    # Handle management fee as percentage of EGR
    mgmt_fee = [expenses['mgmt'][0]]
    for i in range(1, 11):
        mgmt_fee.append(EGR[i] * (expenses['mgmt'][0] / EGR[0]) if EGR[0] != 0 else 0)

    total_opex = []
    for i in range(11):
        opex_components = {k: expenses[k][i] for k in expenses if k != 'mgmt'}
        opex_components['mgmt'] = mgmt_fee[i]
        val = sum(opex_components.values())
        total_opex.append(val)

    NOI = [EGR[i] - total_opex[i] for i in range(11)]

    ti = []
    lc = []
    misc = []

    # ORIGINAL FUNCTION:
    # for i in range(11):
    #     capex = user_inputs.get('capex', {}).get(f'year{i+1}', {'ti': 0, 'lc': 0, 'misc': 0}) # PENDING: E61-O61, E62-O62, E64-O64
    #     ti.append(capex.get('ti', 0))
    #     lc.append(capex.get('lc', 0))
    #     misc.append(capex.get('misc', 0))
    
    # REFACTORED FUNCTION:
    def get_capex_schedules():
        ti_schedule = get_tenant_yearly_values('Tenant Improvements ($)')
        lc_schedule = get_tenant_yearly_values('Leasing Commissions ($)')
        misc_schedule = get_tenant_yearly_values('Misc. CapEx ($)')
        return ti_schedule, lc_schedule, misc_schedule
    
    ti, lc, misc = get_capex_schedules()

    # Correct capital reserves calculation
    reserves = [calculated_inputs.get('CapEx Reserves PF', 0)] # from previous function # [user_inputs.get('capital_reserves_pf', 0)] 
    capex_growth_schedule_whole_numbers = get_cashflow_yearly_values('CapEx Growth Rates') # user_inputs.get('capex_growth_schedule', [0] * 11)
    capex_growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in capex_growth_schedule_whole_numbers]
    
    while len(capex_growth_schedule) < 11:
        capex_growth_schedule.append(0)

    for i in range(1, 11):
        reserves.append(reserves[i - 1] * (1 + capex_growth_schedule[i]))

    # Capital expenditures
    total_capex = [ti[i] + lc[i] + reserves[i] + misc[i] for i in range(11)]
    print(f"NOI: {NOI}")
    print(f"Total Capex: {total_capex}")
    
    # Cash Flow from Operations
    CFO = [NOI[i] - total_capex[i] for i in range(11)]
    print(f"CFO: {CFO}")


    # New metrics
    area = prop_data.square_footage if prop_data.square_footage is not None else 1 # square_footage, properties # user_inputs.get('net_rentable_area', 50000)
    print(f"square_footage: {area}")
    rent_psf = [base_rent[i] / area for i in range(11)] if area > 0 else [0] * 11
    expenses_psf = [total_opex[i] / area for i in range(11)] if area > 0 else [0] * 11
    expense_recovery_pct = [(recovery_income[i] / total_opex[i]) * 100 if total_opex[i] != 0 else 0 for i in range(11)]
    expense_ratio = [(total_opex[i] / EGR[i]) * 100 if EGR[i] != 0 else 0 for i in range(11)]
    capex_pct_noi = [(total_capex[i] / NOI[i]) * 100 if NOI[i] != 0 else 0 for i in range(11)]
    
    # Output 3 equations for Tax Mill Rate:
    cap_rate_at_sale = []
    gross_sales_price = []
    tax_mill_rate = []
    exit_cap_rate_growth_decimal = Decimal(str(financial_chars.exit_cap_rate_growth)) / 10000
    
    for i in range(11):
        if i == 0:
            # For Year 1, the cap rate is the initial market cap rate
            # Convert the whole number percentage to a decimal
            cap_rate_at_sale.append(Decimal(str(financial_chars.market_cap_rate)) / 100) # 6.5 / 100
        else:
            # For subsequent years, add the growth value
            cap_rate = cap_rate_at_sale[i - 1] + exit_cap_rate_growth_decimal
            cap_rate_at_sale.append(cap_rate)
            
    # Calculate gross_sales_price for each year
    for i in range(11):
        # Gross sales price = NOI for each year / cap_rate_at_sale for each year
        # Use a check to prevent division by zero
        if cap_rate_at_sale[i] > 0:
            sales_price = NOI[i] / cap_rate_at_sale[i]
            gross_sales_price.append(sales_price)
        else:
            gross_sales_price.append(Decimal('0.0'))

    # Calculate tax_mill_rate for each year
    
    taxes = expenses['taxes']
    for i in range(11):
        # Tax mill rate = taxes / gross_sales_price
        # Use a check to prevent division by zero
        if gross_sales_price[i] > 0:
            mill_rate = taxes[i] / gross_sales_price[i]
            tax_mill_rate.append(mill_rate * 100)
        else:
            tax_mill_rate.append(Decimal('0.0'))
            
    tax_mill_rate[10] = tax_mill_rate[9] # Although this is mathematically incorrect, this is what it states in the financial model


    print(f"cap_rate_at_sale: {cap_rate_at_sale}")
    print(f"taxes: {taxes}")
    print(f"gross_sales_price: {gross_sales_price}")
    print(f"tax_mill_rate: {tax_mill_rate}")




    
    # tax_mill_rate = [expenses['taxes'] / ]

    data_dict = {
        "Base Rent": base_rent[:11],
        "Recovery Income": recovery_income[:11],
        "Other Income": other_income[:11],
        # "Rent Income": rent_income[:11],
        "PGI": PGI[:11],
        "Rent Abatement": rent_abatement[:11],
        "Vacancy": vacancy[:11],
        "EGR": EGR[:11],
        "Marketing": expenses['marketing'][:11],
        "Administrative": expenses['administrative'][:11],
        "Utilities": expenses['utilities'][:11],
        "Payroll": expenses['payroll'][:11],
        "Maintenance": expenses['repair'][:11],
        "Mgmt Fee": mgmt_fee[:11],
        "Insurance": expenses['insurance'][:11],
        "Taxes": expenses['taxes'][:11],
        "Opex": total_opex[:11],
        "Net Operating Income": NOI[:11],
        "Tenant Improvements": ti[:11],
        "Leasing Commissions": lc[:11],
        "Capital Reserves": reserves[:11],
        "Misc Capex": misc[:11],
        "Capital Expenditures": total_capex[:11],
        "CFO": CFO[:11],
        "Rent PSF": rent_psf[:11],
        "Expenses PSF": expenses_psf[:11],
        "Expense Recovery %": expense_recovery_pct[:11],
        "Expense Ratio": expense_ratio[:11],
        "CapEx as % of NOI": capex_pct_noi[:11],
        "Taxes as % of NOI": tax_mill_rate[:11]
    }

    df = pd.DataFrame(data_dict, index=[f"Year {i+1}" for i in range(11)])
    return df.round(2)


def calculate_output2_fast(property_id, data):
    
    cashflow_inputs_list = data.get('cashflow_inputs', [])
    tenant_profile_yearly_list = data.get('tenant_profile_yearly', [])
    prop_data = data.get('property')
    operating_data = data.get('operating_data')
    financial_chars = data.get('financial_chars')
    
    # Helper function to get a specific value from a list of objects
    def get_value_by_category(record_list, category, column_name):
        record = next((r for r in record_list if r.category == category), None)
        if record and hasattr(record, column_name):
            # Use getattr() to dynamically get the value of the specified column
            value = getattr(record, column_name)
            return Decimal(value) if value is not None else Decimal('0.0')
        return Decimal('0.0')

    
    # INPUT: Net rentable area
    net_rentable_area = prop_data.square_footage  # square_footage, properties
    
    # INPUT: Cash flows (base rent, recovery income, other income)
    base_rent_y0 = get_value_by_category(cashflow_inputs_list, 'Base Rent ($)', 'year_0') # user_inputs.get('base_rent_y0', 0) # category=Base Rent ($) + year_0, cash_flow_inputs
    base_rent_t12 = get_value_by_category(cashflow_inputs_list, 'Base Rent ($)', 't12') # category=Base Rent ($) + t12, cash_flow_inputs
    base_rent_pf = get_value_by_category(cashflow_inputs_list, 'Base Rent ($)', 'pro_forma') # category=Base Rent ($) + pro_forma, cash_flow_inputs

    recovery_income_y0 = get_value_by_category(cashflow_inputs_list, 'Recovery Income ($)', 'year_0') # user_inputs.get('recovery_income_y0', 0) # category=Recovery Income ($) + year_0, cash_flow_inputs
    recovery_income_t12 = get_value_by_category(cashflow_inputs_list, 'Recovery Income ($)', 't12') # user_inputs.get('recovery_income_t12', 0) # category=Recovery Income ($) + t12, cash_flow_inputs
    recovery_income_pf = get_value_by_category(cashflow_inputs_list, 'Recovery Income ($)', 'pro_forma') # user_inputs.get('recovery_income_pf', 0) # category=Recovery Income ($) + pro_forma, cash_flow_inputs

    other_income_y0 = get_value_by_category(cashflow_inputs_list,'Other Income ($)', 'year_0') # user_inputs.get('other_income_y0', 0) # category=Other Income ($) + year_0, cash_flow_inputs
    other_income_t12 = get_value_by_category(cashflow_inputs_list,'Other Income ($)', 't12') # user_inputs.get('other_income_t12', 0) # category=Other Income ($) + t12, cash_flow_inputs
    other_income_pf = get_value_by_category(cashflow_inputs_list,'Other Income ($)', 'pro_forma') # user_inputs.get('other_income_pf', 0) # category=Other Income ($) + pro_forma, cash_flow_inputs


    # INTERMEDIATE: Calculate per SF values
    base_rent_psf_pf = base_rent_pf / net_rentable_area if net_rentable_area > 0 else 0
    recovery_income_psf_pf = recovery_income_pf / net_rentable_area if net_rentable_area > 0 else 0
    other_income_psf_pf = other_income_pf / net_rentable_area if net_rentable_area > 0 else 0
    
    # INTERMEDIATE: Calculate PGI (Potential Gross Income) for each period
    pgi_y0 = base_rent_y0 + recovery_income_y0 + other_income_y0
    pgi_t12 = base_rent_t12 + recovery_income_t12 + other_income_t12
    pgi_pf = base_rent_pf + recovery_income_pf + other_income_pf
    pgi_psf_pf = base_rent_psf_pf + recovery_income_psf_pf + other_income_psf_pf

    # INPUT: Rent Abatement values
    rent_abatement_y0 = get_value_by_category(cashflow_inputs_list,'Rent Abatement ($)', 'year_0') # user_inputs.get('rent_abatement_y0', 0) # category=Rent Abatement ($) + year_0, cash_flow_inputs
    rent_abatement_t12 = get_value_by_category(cashflow_inputs_list,'Rent Abatement ($)', 't12') # user_inputs.get('rent_abatement_t12', 0)  # category=Rent Abatement ($) + t12, cash_flow_inputs
    rent_abatement_pf = get_value_by_category(cashflow_inputs_list,'Rent Abatement ($)', 'pro_forma') # user_inputs.get('rent_abatement_pf', 0)  # category=Rent Abatement ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: Calculate rent abatement
    rent_abatement_psf_pf = rent_abatement_pf / net_rentable_area if net_rentable_area > 0 else 0
    
    
    vacancy_rate_whole_numbers = operating_data.vacancy_rate # user_inputs.get('vacancy_rate', 0) # vacancy_rate, financial_operating_assumptions
    vacancy_rate = Decimal(str(vacancy_rate_whole_numbers)) / 100 if vacancy_rate_whole_numbers is not None else Decimal('0.0')

    # INTERMEDIATE
    vacancy_y0 = (pgi_y0 * vacancy_rate) # -(pgi_y0 * vacancy_rate)
    vacancy_t12 = (pgi_t12 * vacancy_rate)# -(pgi_t12 * vacancy_rate)
    vacancy_pf = (pgi_pf * vacancy_rate)    # -(pgi_pf * vacancy_rate)    
    vacancy_psf_pf = vacancy_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: Other Adjustments values
    other_adjustments_y0 = get_value_by_category(tenant_profile_yearly_list,'Other Adjustments ($)', 'year_0') #  user_inputs.get('other_adjustments_y0', 0) # category=Other Adjustments ($) + year_0, tenant_profile_yearly
    other_adjustments_t12 = get_value_by_category(tenant_profile_yearly_list,'Other Adjustments ($)', 't12') # user_inputs.get('other_adjustments_t12', 0) # category=Other Adjustments ($) + t12, tenant_profile_yearly
    other_adjustments_pf = get_value_by_category(tenant_profile_yearly_list,'Other Adjustments ($)', 'pro_forma') # user_inputs.get('other_adjustments_pf', 0) # category=Other Adjustments ($) + pro_forma, tenant_profile_yearly
    
    # INTERMEDIATE: other adjustments
    other_adjustments_psf_pf = other_adjustments_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INTERMEDIATE: Calculate Effective Gross Revenue (EGR)
    egr_y0 = pgi_y0 - rent_abatement_y0 - vacancy_y0 + other_adjustments_y0 # rent_abatement and vacancy are subtracted from potential gross income
    egr_t12 = pgi_t12 - rent_abatement_t12 - vacancy_t12 + other_adjustments_t12
    egr_pf = pgi_pf - rent_abatement_pf - vacancy_pf + other_adjustments_pf
    egr_psf_pf = pgi_psf_pf - rent_abatement_psf_pf - vacancy_psf_pf + other_adjustments_psf_pf

    # INPUT: Marketing
    marketing_y0 = get_value_by_category(cashflow_inputs_list, 'Marketing ($)', 'year_0') # user_inputs.get('marketing_y0', 0) # category=Marketing ($) + year_0, cash_flow_inputs
    marketing_t12 = get_value_by_category(cashflow_inputs_list, 'Marketing ($)', 't12') # user_inputs.get('marketing_t12', 0) # category=Marketing ($) + t12, cash_flow_inputs
    marketing_pf = get_value_by_category(cashflow_inputs_list, 'Marketing ($)', 'pro_forma')# user_inputs.get('marketing_pf', 0) # category=Marketing ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: administrative 
    marketing_psf_pf = marketing_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: Administrative
    administrative_y0 = get_value_by_category(cashflow_inputs_list, 'Administrative ($)', 'year_0') # user_inputs.get('administrative_y0', 0) # category=Administrative ($) + year_0, cash_flow_inputs
    administrative_t12 = get_value_by_category(cashflow_inputs_list, 'Administrative ($)', 't12') # user_inputs.get('administrative_t12', 0) # category=Administrative ($) + t12, cash_flow_inputs
    administrative_pf = get_value_by_category(cashflow_inputs_list, 'Administrative ($)', 'pro_forma') # user_inputs.get('administrative_pf', 0) # category=Administrative ($) + pro_forma, cash_flow_inputs

    # INTERMEDIATE: administrative
    administrative_psf_pf = administrative_pf / net_rentable_area if net_rentable_area > 0 else 0    

    # INPUT: utilities
    utilities_y0 = get_value_by_category(cashflow_inputs_list, 'Utilities ($)', 'year_0') # user_inputs.get('utilities_y0', 0) # category=Utilities ($) + year_0, cash_flow_inputs
    utilities_t12 = get_value_by_category(cashflow_inputs_list, 'Utilities ($)', 't12')  # user_inputs.get('utilities_t12', 0) # category=Utilities ($) + t12, cash_flow_inputs
    utilities_pf = get_value_by_category(cashflow_inputs_list, 'Utilities ($)', 'pro_forma') # user_inputs.get('utilities_pf', 0) # category=Utilities ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: utilities
    utilities_psf_pf = utilities_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: payroll
    payroll_y0 = get_value_by_category(cashflow_inputs_list, 'Payroll ($)', 'year_0') # user_inputs.get('payroll_y0', 0) # category=Payroll ($) + year_0, cash_flow_inputs
    payroll_t12 = get_value_by_category(cashflow_inputs_list, 'Payroll ($)', 't12') # user_inputs.get('payroll_t12', 0) # category=Payroll ($) + t12, cash_flow_inputs
    payroll_pf = get_value_by_category(cashflow_inputs_list, 'Payroll ($)', 'pro_forma') # user_inputs.get('payroll_pf', 0) # category=Payroll ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: payroll
    payroll_psf_pf = payroll_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: maintenance
    maintenance_y0 = get_value_by_category(cashflow_inputs_list, 'Repair & Maintenance ($)', 'year_0') # user_inputs.get('maintenance_y0', 0) # category=Repair & Maintenance ($) + year_0, cash_flow_inputs
    maintenance_t12 = get_value_by_category(cashflow_inputs_list, 'Repair & Maintenance ($)', 't12') # user_inputs.get('maintenance_t12', 0) # category=Repair & Maintenance ($) + t12, cash_flow_inputs
    maintenance_pf = get_value_by_category(cashflow_inputs_list, 'Repair & Maintenance ($)', 'pro_forma') # user_inputs.get('maintenance_pf', 0) # category=Repair & Maintenance ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: maintenance
    maintenance_psf_pf = maintenance_pf / net_rentable_area if net_rentable_area > 0 else 0
    
    # INPUT: management fee
    mgmt_fee = operating_data.management_fee / 100 # user_inputs.get('mgmt_fee', 0) # managament fee, operating assumptions

    # INTERMEDIATE: management fee
    mgmt_fee_y0 = egr_y0 * mgmt_fee
    mgmt_fee_t12     = egr_t12 * mgmt_fee
    mgmt_fee_pf = egr_pf * mgmt_fee
    mgmt_fee_psf_pf = mgmt_fee_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: insurance
    insurance_y0 = get_value_by_category(cashflow_inputs_list, 'Insurance ($)', 'year_0') # user_inputs.get('insurance_y0', 0) # category=Insurance ($) + year_0, cash_flow_inputs
    insurance_t12 = get_value_by_category(cashflow_inputs_list, 'Insurance ($)', 't12') # user_inputs.get('insurance_t12', 0) # category=Insurance ($) + t12, cash_flow_inputs
    insurance_pf = get_value_by_category(cashflow_inputs_list, 'Insurance ($)', 'pro_forma') # user_inputs.get('insurance_pf', 0) # category=Insurance ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: insurance
    insurance_psf_pf = insurance_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: taxes
    taxes_y0 = get_value_by_category(cashflow_inputs_list, 'Taxes ($)', 'year_0') # user_inputs.get('taxes_y0', 0) # category=Taxes ($) + year_0, cash_flow_inputs
    taxes_t12 = get_value_by_category(cashflow_inputs_list, 'Taxes ($)', 't12') # user_inputs.get('taxes_t12', 0) # category=Taxes ($) + t12, cash_flow_inputs
    taxes_pf = get_value_by_category(cashflow_inputs_list, 'Taxes ($)', 'pro_forma') # user_inputs.get('taxes_pf', 0) # category=Taxes ($) + pro_forma, cash_flow_inputs
    
    # INTERMEDIATE: taxes
    taxes_psf_pf = taxes_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INTERMEDIATE: opex
    opex_y0 = marketing_y0 + administrative_y0 + utilities_y0 + maintenance_y0 + insurance_y0 + taxes_y0 + mgmt_fee_y0 + payroll_y0
    opex_t12 = marketing_t12 + administrative_t12 + utilities_t12 + maintenance_t12 + insurance_t12 + taxes_t12 + mgmt_fee_t12 + payroll_t12
    opex_pf = marketing_pf + administrative_pf + utilities_pf + maintenance_pf + insurance_pf + taxes_pf + mgmt_fee_pf + payroll_pf
    opex_psf_pf = opex_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INTERMEDIATE: Net Operating Income
    net_operating_income_y0 = egr_y0 - opex_y0
    net_operating_income_t12 = egr_t12 - opex_t12
    net_operating_income_pf = egr_pf - opex_pf
    net_operating_income_psf_pf = egr_psf_pf - opex_psf_pf
    
    # INPUT: tenant improvements
    tenant_improvement_y0 = get_value_by_category(tenant_profile_yearly_list,'Tenant Improvements ($)', 'year_0')# user_inputs.get('tenant_improvement_y0', 0) # category=Tenant Improvements ($) + year_0, tenant_profile_yearly
    tenant_improvement_t12 = get_value_by_category(tenant_profile_yearly_list,'Tenant Improvements ($)', 't12') # user_inputs.get('tenant_improvement_t12', 0) # category=Tenant Improvements ($) + t12, tenant_profile_yearly
    tenant_improvement_pf = get_value_by_category(tenant_profile_yearly_list,'Tenant Improvements ($)', 'pro_forma') # user_inputs.get('tenant_improvement_pf', 0) # category=Tenant Improvements ($) + pro_forma, tenant_profile_yearly
    
    # INTERMEDIATE: tenant improvements
    tenant_improvement_psf_pf = tenant_improvement_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: leasing commissions
    lease_commissions_y0 = get_value_by_category(tenant_profile_yearly_list,'Leasing Commissions ($)', 'year_0')# user_inputs.get('lease_commissions_y0', 0) # category=Leasing Commissions ($) + year_0, tenant_profile_yearly
    lease_commissions_t12 = get_value_by_category(tenant_profile_yearly_list,'Leasing Commissions ($)', 't12') # user_inputs.get('lease_commissions_t12', 0) # category=Leasing Commissions ($) + t12, tenant_profile_yearly
    lease_commissions_pf = get_value_by_category(tenant_profile_yearly_list,'Leasing Commissions ($)', 'pro_forma') # user_inputs.get('lease_commissions_pf', 0) # category=Leasing Commissions ($) + pro_forma, tenant_profile_yearly
    
    # INTERMEDIATE: leasing commissions
    lease_commissions_psf_pf = lease_commissions_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: capital reserves
    capital_reserves_y0 = get_value_by_category(tenant_profile_yearly_list,'CapEx Reserves ($)', 'year_0') # user_inputs.get('capital_reserves_y0', 0) # category=CapEx Reserves ($) + year_0, tenant_profile_yearly
    capital_reserves_t12 = get_value_by_category(tenant_profile_yearly_list,'CapEx Reserves ($)', 't12') # user_inputs.get('capital_reserves_t12', 0) # category=CapEx Reserves ($) + t12, tenant_profile_yearly
    capital_reserves_pf = get_value_by_category(tenant_profile_yearly_list,'CapEx Reserves ($)', 'pro_forma')# user_inputs.get('capital_reserves_pf', 0) # category=CapEx Reserves ($) + pro_forma, tenant_profile_yearly

    # INTERMEDIATE: capital reserves
    capital_reserves_psf_pf = capital_reserves_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INPUT: misc capex
    misc_capex_y0 = get_value_by_category(tenant_profile_yearly_list,'Misc. CapEx ($)', 'year_0') # user_inputs.get('misc_capex_y0', 0) # category=Misc. CapEx ($) + year_0, tenant_profile_yearly
    misc_capex_t12 = get_value_by_category(tenant_profile_yearly_list,'Misc. CapEx ($)', 't12') # user_inputs.get('misc_capex_t12', 0) # category=Misc. CapEx ($) + t12, tenant_profile_yearly
    misc_capex_pf = get_value_by_category(tenant_profile_yearly_list,'Misc. CapEx ($)', 'pro_forma') # user_inputs.get('misc_capex_pf', 0) # category=Misc. CapEx ($) + pro_forma, tenant_profile_yearly
    
    # INTERMEDIATE: misc capex
    misc_capex_psf_pf = misc_capex_pf / net_rentable_area if net_rentable_area > 0 else 0

    # INTERMEDIATE: capital expenditures
    capital_expenditures_y0 = tenant_improvement_y0 + lease_commissions_y0 + capital_reserves_y0 + misc_capex_y0
    capital_expenditures_t12 = tenant_improvement_t12 + lease_commissions_t12 + capital_reserves_t12 + misc_capex_t12
    capital_expenditures_pf = tenant_improvement_pf + lease_commissions_pf + capital_reserves_pf + misc_capex_pf
    capital_expenditures_psf_pf = tenant_improvement_psf_pf + lease_commissions_psf_pf + capital_reserves_psf_pf + misc_capex_psf_pf

    cash_flow_from_operations_y0 = net_operating_income_y0 - capital_expenditures_y0
    cash_flow_from_operations_t12 = net_operating_income_t12 - capital_expenditures_t12
    cash_flow_from_operations_pf = net_operating_income_pf - capital_expenditures_pf
    cash_flow_from_operations_psf_pf = net_operating_income_psf_pf - capital_expenditures_psf_pf    

    # INTERMEDIATE: Operating metrics
    rent_psf_y0 = base_rent_y0 / net_rentable_area if net_rentable_area > 0 else 0
    rent_psf_t12 = base_rent_t12 / net_rentable_area if net_rentable_area > 0 else 0
    rent_psf_pf = base_rent_pf / net_rentable_area if net_rentable_area > 0 else 0

    expense_psf_y0 = opex_y0 / net_rentable_area if net_rentable_area > 0 else 0
    expense_psf_t12 = opex_t12 / net_rentable_area if net_rentable_area > 0 else 0
    expense_psf_pf = opex_pf / net_rentable_area if net_rentable_area > 0 else 0

    expense_recovery_pct_y0 = (recovery_income_y0 / opex_y0) * 100
    expense_recovery_pct_t12 = (recovery_income_t12 / opex_t12) * 100
    expense_recovery_pct_pf = (recovery_income_pf / opex_pf) * 100

    expense_ratio_y0 = (opex_y0 / egr_y0) * 100
    expense_ratio_t12 = (opex_t12 / egr_t12) * 100
    expense_ratio_pf = (opex_pf / egr_pf) * 100

    capex_noi_y0 = (capital_expenditures_y0 / net_operating_income_y0) * 100
    capex_noi_t12 = (capital_expenditures_t12 / net_operating_income_t12) * 100
    capex_noi_pf = (capital_expenditures_pf / net_operating_income_pf) * 100

    capex_egr_y0 = (capital_expenditures_y0 / egr_y0) * 100
    capex_egr_t12 = (capital_expenditures_t12 / egr_t12) * 100
    capex_egr_pf = (capital_expenditures_pf / egr_pf) * 100

    # INPUT: exit cap rate growth
    exit_cap_y1 = financial_chars.market_cap_rate / 100 # market_cap_rate, property_financials_and_characteristics

    gross_sales_price = net_operating_income_pf / exit_cap_y1 # user_inputs.get('gross_sales_price', 24508467) # purchase_price OR selling_cost_at_exit
    tax_mill_y0 = (taxes_y0 / gross_sales_price)*100
    tax_mill_t12 = (taxes_t12 / gross_sales_price)*100
    tax_mill_pf = (taxes_pf / gross_sales_price)*100
    
    # user_inputs["mgmt_fee_pf"]= mgmt_fee_pf
    
    calculated_inputs = {
        'Vacancy PF': vacancy_pf,
        'CapEx Reserves PF': capital_reserves_pf,
    }
    
    detailed_financials = calculate_detailed_financials_fast(calculated_inputs, data) 
      
    # Create summary response
    summary = { 
        'Base Rent Y0': base_rent_y0,
        'Base Rent T12': base_rent_t12,
        'Base Rent PF': base_rent_pf,
        'Base Rent PSF PF': round(base_rent_psf_pf, 2),
        'Recovery Income Y0': recovery_income_y0,
        'Recovery Income T12': recovery_income_t12,
        'Recovery Income PF': recovery_income_pf,
        'Recovery Income PSF PF': round(recovery_income_psf_pf, 2),
        'Other Income Y0': other_income_y0,
        'Other Income T12': other_income_t12,
        'Other Income PF': other_income_pf,
        'Other Income PSF PF': round(other_income_psf_pf, 2),
        'PGI Y0': pgi_y0,
        'PGI T12': pgi_t12,
        'PGI PF': pgi_pf,
        'PGI PSF PF': round(pgi_psf_pf, 2),
        'Rent Abatement Y0': rent_abatement_y0,
        'Rent Abatement T12': rent_abatement_t12,
        'Rent Abatement PF': rent_abatement_pf,
        'Rent Abatement PSF PF': round(rent_abatement_psf_pf, 2),
        'Vacancy Y0': vacancy_y0,
        'Vacancy T12': vacancy_t12,
        'Vacancy PF': vacancy_pf,
        'Vacancy PSF PF': round(vacancy_psf_pf, 2),
        'Other Adjustments Y0': other_adjustments_y0,
        'Other Adjustments T12': other_adjustments_t12,
        'Other Adjustments PF': other_adjustments_pf,
        'Other Adjustments PSF PF': round(other_adjustments_psf_pf, 2),
        'EGR Y0': round(egr_y0,2),
        'EGR T12': round(egr_t12,2),
        'EGR PF': round(egr_pf,2),
        'EGR PSF PF': round(egr_psf_pf, 2), 
        'Net Rentable Area': net_rentable_area,
        'Vacancy Rate': vacancy_rate,
        'Marketing Y0': marketing_y0,
        'Marketing T12': marketing_t12,
        'Marketing PF': marketing_pf,
        'Marketing PSF PF': round(marketing_psf_pf, 2),
        'Administrative Y0': administrative_y0,
        'Administrative T12': administrative_t12,
        'Administrative PF': administrative_pf,
        'Administrative PSF PF': round(administrative_psf_pf, 2),
        'Utilities Y0': utilities_y0,
        'Utilities T12': utilities_t12,
        'Utilities PF': utilities_pf,
        'Utilities PSF PF': round(utilities_psf_pf, 2),
        'Payroll Y0': payroll_y0,
        'Payroll T12': payroll_t12,
        'Payroll PF': payroll_pf,
        'Payroll PSF PF': round(payroll_psf_pf, 2),
        'Maintenance Y0': maintenance_y0,
        'Maintenance T12': maintenance_t12,
        'Maintenance PF': maintenance_pf,
        'Maintenance PSF PF': round(maintenance_psf_pf, 2),
        'Mgmt Fee Y0': round(mgmt_fee_y0,2),
        'Mgmt Fee T12': round(mgmt_fee_t12,2),
        'Mgmt Fee PF': round(mgmt_fee_pf,2),
        'Mgmt Fee PSF PF': round(mgmt_fee_psf_pf, 2),
        'Mgmt Fee %': mgmt_fee,
        'Insurance Y0': insurance_y0,
        'Insurance T12': insurance_t12,
        'Insurance PF': insurance_pf,
        'Insurance PSF PF': round(insurance_psf_pf, 2),
        'Taxes Y0': taxes_y0,
        'Taxes T12': taxes_t12,
        'Taxes PF': taxes_pf,
        'Taxes PSF PF': round(taxes_psf_pf, 2),
        'Opex Y0': round(opex_y0, 2),
        'Opex T12': round(opex_t12, 2),
        'Opex PF': round(opex_pf, 2),
        'Opex PSF PF': round(opex_psf_pf, 2),
        'Net Operating Income Y0': round(net_operating_income_y0, 2),
        'Net Operating Income T12': round(net_operating_income_t12, 2),
        'Net Operating Income PF': round(net_operating_income_pf, 2),
        'Net Operating Income PSF PF': round(net_operating_income_psf_pf, 2),
        'Tenant Improvement Y0': tenant_improvement_y0,
        'Tenant Improvement T12': tenant_improvement_t12,
        'Tenant Improvement PF': tenant_improvement_pf,
        'Tenant Improvement PSF PF': round(tenant_improvement_psf_pf, 2),
        'Leasing Commissions Y0': lease_commissions_y0,
        'Leasing Commissions T12': lease_commissions_t12,
        'Leasing Commissions PF': lease_commissions_pf,
        'Leasing Commissions PSF PF': round(lease_commissions_psf_pf, 2),
        'Capital Reserves Y0': round(capital_reserves_y0, 2),
        'Capital Reserves T12': round(capital_reserves_t12, 2),
        'Capital Reserves PF': round(capital_reserves_pf, 2),
        'Capital Reserves PSF PF': round(capital_reserves_psf_pf, 2),
        'Misc Capex Y0': round(misc_capex_y0, 2),
        'Misc Capex T12': round(misc_capex_t12, 2),
        'Misc Capex PF': round(misc_capex_pf, 2),
        'Misc Capex PSF PF': round(misc_capex_psf_pf, 2),
        'Capital Expenditures Y0': round(capital_expenditures_y0, 2),
        'Capital Expenditures T12': round(capital_expenditures_t12, 2),
        'Capital Expenditures PF': round(capital_expenditures_pf, 2),
        'Capital Expenditures PSF PF': round(capital_expenditures_psf_pf, 2),
        'CFO Y0': round(cash_flow_from_operations_y0, 2),
        'CFO T12': round(cash_flow_from_operations_t12, 2),
        'CFO PF': round(cash_flow_from_operations_pf, 2),
        'CFO PSF PF': round(cash_flow_from_operations_psf_pf, 2),
        'Rent PSF Y0': round(rent_psf_y0, 2),
        'Rent PSF T12': round(rent_psf_t12, 2),
        'Rent PSF PF': round(rent_psf_pf, 2),
        'Expenses PSF Y0': round(expense_psf_y0, 2),
        'Expenses PSF T12': round(expense_psf_t12, 2),
        'Expenses PSF PF': round(expense_psf_pf, 2),
        'Expense Recovery % Y0': round(expense_recovery_pct_y0, 2),
        'Expense Recovery % T12': round(expense_recovery_pct_t12, 2),
        'Expense Recovery % PF': round(expense_recovery_pct_pf, 2),
        'Expense Ratio Y0': round(expense_ratio_y0, 2),
        'Expense Ratio T12': round(expense_ratio_t12, 2),
        'Expense Ratio PF': round(expense_ratio_pf, 2),
        'CapEx as % of NOI Y0': round(capex_noi_y0, 2),
        'CapEx as % of NOI T12': round(capex_noi_t12, 2),
        'CapEx as % of NOI PF': round(capex_noi_pf, 2),
        'Taxes as % of NOI Y0': round(tax_mill_y0, 2),
        'Taxes as % of NOI T12': round(tax_mill_t12, 2),
        'Taxes as % of NOI PF': round(tax_mill_pf, 2),
        'projections': detailed_financials.to_dict(index=[f"Year {i+1}" for i in range(11)])
    }
    
    # Update / Post to the Output 2 Table in Database
    category_mapping = {
        "Administrative": "Administrative",
        "Base Rent": "Base Rent",
        "Capital Expenditures": "Capital Expenditures",
        "Capital Reserves": "Capital Reserves",
        "CapEx as % of NOI": "CapEx as % of NOI",
        "CFO": "CFO", # Mapped from the correct summary key
        "EGR": "EGR", # Mapped from the correct summary key
        "Expense Ratio": "Expense Ratio",
        "Expense Recovery %": "Expense Recovery %",
        "Expenses PSF": "Expenses PSF",
        "Insurance": "Insurance",
        "Leasing Commissions": "Leasing Commissions",
        "Marketing": "Marketing",
        "Mgmt Fee": "Mgmt Fee", # Mapped from the correct summary key
        "Misc Capex": "Misc Capex",
        "Net Operating Income": "Net Operating Income",
        "Opex": "Opex", # Mapped from the correct summary key
        "Other Income": "Other Income",
        "PGI": "PGI", # Mapped from the correct summary key
        "Payroll": "Payroll",
        "Recovery Income": "Recovery Income",
        "Rent Abatement": "Rent Abatement",
        "Rent PSF": "Rent PSF",
        "Maintenance": "Maintenance", # Correct key is "Maintenance"
        "Taxes": "Taxes",
        "Tenant Improvement": "Tenant Improvement", # Correct key is "Tenant Improvement"
        "Utilities": "Utilities",
        "Vacancy": "Vacancy",
        "Taxes as % of NOI": "Taxes as % of NOI"
    }

        
    # The keys in the main JSON object for T12, Y0, PF, and PSF PF
    json_keys = {
        'Y0': 'Y0',
        'T12': 'T12',
        'PF': 'PF',
        'PSF PF': 'PSF PF'
    }
    
    print("output2: done with calculations, logging it to output")
    
    existing_entries = Output2.query.filter_by(property_id=property_id).all()
    entry_map = {entry.category: entry for entry in existing_entries}
    
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return default

    existing_entries_ids = db.session.query(Output2.category, Output2.id).filter_by(property_id=property_id).all()
    entry_id_map = {category: id for category, id in existing_entries_ids}

    updates = []
    inserts = []

    # Iterate through each category in our mapping
    for json_category, db_category in category_mapping.items():
        entry_data = {
            'property_id': property_id,
            'category': db_category
        }

        # Populate the columns from the summary dictionary
        t12_key = f"{json_category} {json_keys['T12']}"
        y0_key = f"{json_category} {json_keys['Y0']}"
        pf_key = f"{json_category} {json_keys['PF']}"
        psf_pf_key = f"{json_category} {json_keys['PSF PF']}"
        
        entry_data['year_0'] = to_decimal(summary.get(y0_key))
        entry_data['t12'] = to_decimal(summary.get(t12_key))
        entry_data['pro_forma'] = to_decimal(summary.get(pf_key))
        entry_data['psf_pro_forma'] = to_decimal(summary.get(psf_pf_key))

        # Handle special cases
        if json_category == "Mgmt Fee":
            entry_data['pro_forma'] = to_decimal(summary.get('Mgmt Fee PF'))
        elif json_category == "Expense PSF":
            entry_data['psf_pro_forma'] = to_decimal(summary.get('Expense PSF PF'))
        elif json_category == "Vacancy":
            entry_data['pro_forma'] = to_decimal(summary.get('Vacancy PF'))

        # Populate yearly projection values
        if 'projections' in summary and json_category in summary['projections']:
            projection_data = summary['projections'][json_category]
            for i in range(1, 12):
                year_key = f"Year {i}"
                db_column_name = f"year_{i}"
                if year_key in projection_data:
                    entry_data[db_column_name] = to_decimal(projection_data.get(year_key))
                else:
                    entry_data[db_column_name] = None
        
        # Check if we should update or insert
        if db_category in entry_id_map:
            # Add the ID for the bulk update mapping
            entry_data['id'] = entry_id_map[db_category]
            updates.append(entry_data)
        else:
            # Create a new object for bulk saving
            inserts.append(Output2(**entry_data))
            
            
    if updates:
        # Use bulk_update_mappings for updating existing records
        db.session.bulk_update_mappings(Output2, updates)
    if inserts:
        # Use bulk_save_objects for inserting new records
        db.session.bulk_save_objects(inserts)
        
    # Commit all changes to the database at once after the loop completes
    db.session.commit()
    current_app.logger.info(f"All Output 2 categories saved/updated for Property ID: {property_id}")
    
    print("output2: done logging it to output")
    
    return summary


# "projections" section above, Outputs AO to AY
def calculate_detailed_financials_fast(calculated_inputs, data):
    # This function is kept for backward compatibility
    # For now, we'll use the new calculation method
    
    cashflow_inputs_list = data.get('cashflow_inputs', [])
    cashflow_yearly_list = data.get('cashflow_projection_yearly', [])
    tenant_profile_yearly_list = data.get('tenant_profile_yearly', [])
    prop_data = data.get('property')
    operating_data = data.get('operating_data')
    financial_chars = data.get('financial_chars')
        
    # Helper function to get a specific value from a list of objects
    def get_value_by_category(record_list, category, column_name):
        record = next((r for r in record_list if r.category == category), None)
        if record and hasattr(record, column_name):
            # Use getattr() to dynamically get the value of the specified column
            value = getattr(record, column_name)
            # print("value: ", value, "column_name: ", column_name, "category: ", category)
            return Decimal(value) if value is not None else Decimal('0.0')
        return Decimal('0.0')

    
    def get_yearly_values(record_list, category):
        
        yearly_values = [
            get_value_by_category(record_list, category, 'year_1'),
            get_value_by_category(record_list, category, 'year_2'),
            get_value_by_category(record_list, category, 'year_3'),
            get_value_by_category(record_list, category, 'year_4'),
            get_value_by_category(record_list, category, 'year_5'),
            get_value_by_category(record_list, category, 'year_6'),
            get_value_by_category(record_list, category, 'year_7'),
            get_value_by_category(record_list, category, 'year_8'),
            get_value_by_category(record_list, category, 'year_9'),
            get_value_by_category(record_list, category, 'year_10'),
            get_value_by_category(record_list, category, 'year_11'),
        ]
        
        return yearly_values

    base_rent = [get_value_by_category(cashflow_inputs_list, 'Base Rent ($)', 'pro_forma')] # [user_inputs.get('base_rent_pf', 0)]
    recovery_income = [get_value_by_category(cashflow_inputs_list, 'Recovery Income ($)', 'pro_forma')] # [user_inputs.get('recovery_income_pf', 0)]
    other_income = [get_value_by_category(cashflow_inputs_list, 'Other Income ($)', 'pro_forma')] # [user_inputs.get('other_income_pf', 0)]
    # rent_income = [get_cashflow_proforma_value('Income Growth Rates')]# REMOVED: [user_inputs.get('rent_income_pf', 0)]

    growth_schedule_whole_numbers = get_yearly_values(cashflow_yearly_list, 'Income Growth Rates') # user_inputs.get('rent_income_growth_schedule', [0] * 11) # A69: takes all percentages from Year1-11
    # print("growth schedule: ", growth_schedule_whole_numbers)
    growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in growth_schedule_whole_numbers]
    while len(growth_schedule) < 11:
        growth_schedule.append(0)

    for i in range(1, 11):
        growth = growth_schedule[i] if i < len(growth_schedule) else 0
        base_rent.append(base_rent[i - 1] * (1 + growth))
        recovery_income.append(recovery_income[i - 1] * (1 + growth))
        other_income.append(other_income[i - 1] * (1 + growth))
        # rent_income.append(rent_income[i - 1] * (1 + growth)) REMOVED

    # print(f"Base rent list length: {len(base_rent)} contents: {base_rent}")
    # print(f"Recovery income list length: {len(recovery_income)} contents: {recovery_income}")
    # print(f"Other income list length: {len(other_income)} contents: {other_income}")
    # The following line will likely expose an IndexError if the lengths are not 11
    PGI = [base_rent[i] + recovery_income[i] + other_income[i] for i in range(11)] # + rent_income[i] REMOVED
    rent_abatement = [get_value_by_category(cashflow_inputs_list, 'Rent Abatement ($)', 'pro_forma')] + [0] * 10 # [user_inputs.get('rent_abatement_pf', 0)] + [0]*10

    vacancy_schedule_whole_numbers = get_yearly_values(cashflow_yearly_list, 'Vacancy Rates')# user_inputs.get('vacancy_schedule', [0] * 11) # A68: takes all percentages from Year1-11
    pro_forma_vacancy = calculated_inputs.get('Vacancy PF')
    vacancy_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in vacancy_schedule_whole_numbers]
    
    if vacancy_schedule is None:
        vacancy_schedule = [0] * 11

    while len(vacancy_schedule) < 11:
        vacancy_schedule.append(0)

    vacancy = [PGI[i] * Decimal(item) if item is not None else Decimal('0.0') for i, item in enumerate(vacancy_schedule)] # [PGI[i] * vacancy_schedule[i] for i in range(11)]
    vacancy[0] = pro_forma_vacancy # Overwrite the Year 1 Vacancy
    
    EGR = [PGI[i] - rent_abatement[i] - vacancy[i] for i in range(11)]

    # Standardized expense categories
    expenses = {
        "marketing": [get_value_by_category(cashflow_inputs_list, 'Marketing ($)', 'pro_forma')],# [user_inputs.get('marketing_pf', 0)],
        "administrative": [get_value_by_category(cashflow_inputs_list, 'Administrative ($)', 'pro_forma')], # [user_inputs.get('administrative_pf', 0)],
        "utilities": [get_value_by_category(cashflow_inputs_list, 'Utilities ($)', 'pro_forma')], # [user_inputs.get('utilities_pf', 0)],
        "payroll": [get_value_by_category(cashflow_inputs_list, 'Payroll ($)', 'pro_forma')],# [user_inputs.get('payroll_pf', 0)],
        "repair": [get_value_by_category(cashflow_inputs_list, 'Repair & Maintenance ($)', 'pro_forma')],# [user_inputs.get('maintenance_pf', 0)],
        "mgmt": [get_value_by_category(cashflow_inputs_list, 'Mgmt of EGR ($)', 'pro_forma')],# [user_inputs.get('mgmt_fee_pf', 0)],
        "insurance": [get_value_by_category(cashflow_inputs_list, 'Insurance ($)', 'pro_forma')],# [user_inputs.get('insurance_pf', 0)],
        "taxes": [get_value_by_category(cashflow_inputs_list, 'Taxes ($)', 'pro_forma')],# [user_inputs.get('taxes_pf', 0)]
    }

    opex_growth_schedule_whole_numbers = get_yearly_values(cashflow_yearly_list, 'Opex Growth Excluding Taxes Rates') # user_inputs.get('opex_growth_schedule', [0] * 11) # A70, from Year1-11
    opex_growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in opex_growth_schedule_whole_numbers]
    
    while len(opex_growth_schedule) < 11:
        opex_growth_schedule.append(0)

    for k in expenses:
        for i in range(1, 11):
            growth = opex_growth_schedule[i] if i < len(opex_growth_schedule) else 0
            expenses[k].append(expenses[k][i - 1] * (1 + growth))

    # Handle management fee as percentage of EGR
    mgmt_fee = [expenses['mgmt'][0]]
    for i in range(1, 11):
        mgmt_fee.append(EGR[i] * (expenses['mgmt'][0] / EGR[0]) if EGR[0] != 0 else 0)

    total_opex = []
    for i in range(11):
        opex_components = {k: expenses[k][i] for k in expenses if k != 'mgmt'}
        opex_components['mgmt'] = mgmt_fee[i]
        val = sum(opex_components.values())
        total_opex.append(val)

    NOI = [EGR[i] - total_opex[i] for i in range(11)]

    ti = []
    lc = []
    misc = []

    # ORIGINAL FUNCTION:
    # for i in range(11):
    #     capex = user_inputs.get('capex', {}).get(f'year{i+1}', {'ti': 0, 'lc': 0, 'misc': 0}) # PENDING: E61-O61, E62-O62, E64-O64
    #     ti.append(capex.get('ti', 0))
    #     lc.append(capex.get('lc', 0))
    #     misc.append(capex.get('misc', 0))
    
    # REFACTORED FUNCTION:
    def get_capex_schedules():
        ti_schedule = get_yearly_values(tenant_profile_yearly_list, 'Tenant Improvements ($)')
        lc_schedule = get_yearly_values(tenant_profile_yearly_list, 'Leasing Commissions ($)')
        misc_schedule = get_yearly_values(tenant_profile_yearly_list, 'Misc. CapEx ($)')
        return ti_schedule, lc_schedule, misc_schedule
    
    ti, lc, misc = get_capex_schedules()
    # print(ti, lc, misc)

    # Correct capital reserves calculation
    reserves = [calculated_inputs.get('CapEx Reserves PF', 0)] # from previous function # [user_inputs.get('capital_reserves_pf', 0)] 
    capex_growth_schedule_whole_numbers = get_yearly_values(cashflow_yearly_list, 'CapEx Growth Rates') # user_inputs.get('capex_growth_schedule', [0] * 11)
    capex_growth_schedule = [Decimal(str(item)) / 100 if item is not None else Decimal('0.0') for item in capex_growth_schedule_whole_numbers]
    # print("capex_growth_schedule: ", capex_growth_schedule)
    
    while len(capex_growth_schedule) < 11:
        capex_growth_schedule.append(0)

    for i in range(1, 11):
        reserves.append(reserves[i - 1] * (1 + capex_growth_schedule[i]))

    # Capital expenditures
    total_capex = [ti[i] + lc[i] + reserves[i] + misc[i] for i in range(11)]
    # print(f"NOI: {NOI}")
    # print(f"Total Capex: {total_capex}")
    
    # Cash Flow from Operations
    CFO = [NOI[i] - total_capex[i] for i in range(11)]
    # print(f"CFO: {CFO}")


    # New metrics
    area = prop_data.square_footage if prop_data.square_footage is not None else 1 # square_footage, properties # user_inputs.get('net_rentable_area', 50000)
    # print(f"square_footage: {area}")
    rent_psf = [base_rent[i] / area for i in range(11)] if area > 0 else [0] * 11
    expenses_psf = [total_opex[i] / area for i in range(11)] if area > 0 else [0] * 11
    expense_recovery_pct = [(recovery_income[i] / total_opex[i]) * 100 if total_opex[i] != 0 else 0 for i in range(11)]
    expense_ratio = [(total_opex[i] / EGR[i]) * 100 if EGR[i] != 0 else 0 for i in range(11)]
    capex_pct_noi = [(total_capex[i] / NOI[i]) * 100 if NOI[i] != 0 else 0 for i in range(11)]
    
    # Output 3 equations for Tax Mill Rate:
    cap_rate_at_sale = []
    gross_sales_price = []
    tax_mill_rate = []
    exit_cap_rate_growth_decimal = Decimal(str(financial_chars.exit_cap_rate_growth)) / 10000
    
    for i in range(11):
        if i == 0:
            # For Year 1, the cap rate is the initial market cap rate
            # Convert the whole number percentage to a decimal
            cap_rate_at_sale.append(Decimal(str(financial_chars.market_cap_rate)) / 100) # 6.5 / 100
        else:
            # For subsequent years, add the growth value
            cap_rate = cap_rate_at_sale[i - 1] + exit_cap_rate_growth_decimal
            cap_rate_at_sale.append(cap_rate)
            
    # Calculate gross_sales_price for each year
    for i in range(11):
        # Gross sales price = NOI for each year / cap_rate_at_sale for each year
        # Use a check to prevent division by zero
        if cap_rate_at_sale[i] > 0:
            sales_price = NOI[i] / cap_rate_at_sale[i]
            gross_sales_price.append(sales_price)
        else:
            gross_sales_price.append(Decimal('0.0'))

    # Calculate tax_mill_rate for each year
    
    taxes = expenses['taxes']
    for i in range(11):
        # Tax mill rate = taxes / gross_sales_price
        # Use a check to prevent division by zero
        if gross_sales_price[i] > 0:
            mill_rate = taxes[i] / gross_sales_price[i]
            tax_mill_rate.append(mill_rate * 100)
        else:
            tax_mill_rate.append(Decimal('0.0'))
            
    tax_mill_rate[10] = tax_mill_rate[9] # Although this is mathematically incorrect, this is what it states in the financial model


    # print(f"cap_rate_at_sale: {cap_rate_at_sale}")
    # print(f"taxes: {taxes}")
    # print(f"gross_sales_price: {gross_sales_price}")
    # print(f"tax_mill_rate: {tax_mill_rate}")

    data_dict = {
        "Base Rent": base_rent[:11],
        "Recovery Income": recovery_income[:11],
        "Other Income": other_income[:11],
        # "Rent Income": rent_income[:11],
        "PGI": PGI[:11],
        "Rent Abatement": rent_abatement[:11],
        "Vacancy": vacancy[:11],
        "EGR": EGR[:11],
        "Marketing": expenses['marketing'][:11],
        "Administrative": expenses['administrative'][:11],
        "Utilities": expenses['utilities'][:11],
        "Payroll": expenses['payroll'][:11],
        "Maintenance": expenses['repair'][:11],
        "Mgmt Fee": mgmt_fee[:11],
        "Insurance": expenses['insurance'][:11],
        "Taxes": expenses['taxes'][:11],
        "Opex": total_opex[:11],
        "Net Operating Income": NOI[:11],
        "Tenant Improvements": ti[:11],
        "Leasing Commissions": lc[:11],
        "Capital Reserves": reserves[:11],
        "Misc Capex": misc[:11],
        "Capital Expenditures": total_capex[:11],
        "CFO": CFO[:11],
        "Rent PSF": rent_psf[:11],
        "Expenses PSF": expenses_psf[:11],
        "Expense Recovery %": expense_recovery_pct[:11],
        "Expense Ratio": expense_ratio[:11],
        "CapEx as % of NOI": capex_pct_noi[:11],
        "Taxes as % of NOI": tax_mill_rate[:11]
    }

    df = pd.DataFrame(data_dict, index=[f"Year {i+1}" for i in range(11)])
    return df.round(2)