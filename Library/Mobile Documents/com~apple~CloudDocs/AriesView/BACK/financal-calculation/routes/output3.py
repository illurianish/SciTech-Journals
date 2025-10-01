from decimal import Decimal
import decimal
import nest_asyncio
from flask import Flask, request, jsonify, Blueprint, current_app
from flasgger import Swagger, swag_from
import numpy_financial as npf
from collections import OrderedDict
from firebase_admin import auth
from flask_cors import cross_origin

nest_asyncio.apply()

from models import (
  db, Property, FinancialAssumption, Output2,
  FinancialAcquisitionCost, PropertyFinancialsAndCharacteristic, Output3
)

output3_bp = Blueprint('output3', __name__)

@output3_bp.route('/output3/<string:property_id>', methods=['POST'])
@cross_origin()
@swag_from({
    'tags': ['Output 3'],
    'description': 'This endpoint calculates a complete acquisition model for a given property_id. It expects a Firebase authentication token in the request body, which will be verified to ensure property ownership.',
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
        'AcquisitionModel': {
            'type': 'object',
            'properties': {
              'Purchase Price': { '$ref': '#/definitions/YearlyData' },
              'Upfront CapEx': { '$ref': '#/definitions/YearlyData' },
              'Due Dilligence + Closing Cost': { '$ref': '#/definitions/YearlyData' },
              'Total Acquisition Costs': { '$ref': '#/definitions/YearlyData' },
              'Loan Amount': { '$ref': '#/definitions/YearlyData' },
              'Loan Fees': { '$ref': '#/definitions/YearlyData' },
              'Net Loan Funding': { '$ref': '#/definitions/YearlyData' },
              'Effective Gross Revenue': { '$ref': '#/definitions/YearlyData' },
              'Operating Expenses': { '$ref': '#/definitions/YearlyData' },
              'Net Operating Income': { '$ref': '#/definitions/YearlyData' },
              'Capital Expenditures': { '$ref': '#/definitions/YearlyData' },
              'Cash Flow From Operations': { '$ref': '#/definitions/YearlyData' },
              'Debt Service': { '$ref': '#/definitions/YearlyData' },
              'Cash Flow after Financing': { '$ref': '#/definitions/YearlyData' },
              'Cap Rate at Sale (%)': { '$ref': '#/definitions/YearlyData' },
              'Gross Sales Price': { '$ref': '#/definitions/YearlyData' },
              'Selling Costs': { '$ref': '#/definitions/YearlyData' },
              'Net Sales Proceeds': { '$ref': '#/definitions/YearlyData' },
              'Net Sales Price PSF': { '$ref': '#/definitions/YearlyData' },
              'Loan Payoff': { '$ref': '#/definitions/YearlyData' },
              'Unlevered Investment Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Unlevered Operating Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Unlevered Reversion Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Unlevered Net Unlevered Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Free and Clear Return (%)': { '$ref': '#/definitions/YearlyData' },
              'Avg. Free and Clear Return (%)': { '$ref': '#/definitions/YearlyData' },
              'Unlevered IRR (%)': { 'type': "string" },
              'Unlevered Equity Multiple': { 'type': "string" },
              'Levered Investment Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Levered Operating Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Levered Reversion Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Levered Net Unlevered Cash Flow': { '$ref': '#/definitions/YearlyData' },
              'Cash-on-Cash Return (%)': { '$ref': '#/definitions/YearlyData' },
              'Avg. Cash-on-Cash Return (%)': { '$ref': '#/definitions/YearlyData' },
              'Levered IRR (%)': { 'type': "string" },
              'Levered Equity Multiple': { 'type': "string" },
              'Debt Coverage Ratio (NOI)': { '$ref': '#/definitions/YearlyData' },
              'Debt Yield (NOI) (%)': { '$ref': '#/definitions/YearlyData' },
              'Unlevered Internal Rate of Return Calculation': { 'type': "array", 'items': { 'type': "object", 'description': "Calculation steps for unlevered IRR." } },
              'Levered Internal Rate of Return Calculation': { 'type': "array", 'items': { 'type': "object", 'description': "Calculation steps for levered IRR." } }
            }
        },
        'YearlyData': {
            'type': 'object',
            'properties': {
              'year_0': { 'type': 'string' },
              'year_1': { 'type': 'string' },
              'year_2': { 'type': 'string' },
              'year_3': { 'type': 'string' },
              'year_4': { 'type': 'string' },
              'year_5': { 'type': 'string' },
              'year_6': { 'type': 'string' },
              'year_7': { 'type': 'string' },
              'year_8': { 'type': 'string' },
              'year_9': { 'type': 'string' },
              'year_10': { 'type': 'string' }
            },
            'description': 'Financial data for each year of the analysis period.'
        }
    },
    'responses': {
        200: {
            'description': 'Complete income statement summary with calculations.',
            'schema': {
                '$ref': '#/definitions/AcquisitionModel'
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
def output3_endpoint(property_id):
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
    
    output3 = calculate_output3(property_id, firebase_uid)
    return output3

def calculate_output3(property_id, firebase_uid):
  try:
    prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
    if not prop_data:
        current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
        return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
    else:
        current_app.logger.info(f"Successfully retrieved properties database {property_id}. properties: {prop_data}")
        
    acq_costs = FinancialAcquisitionCost.query.filter_by(property_id=property_id).first()
    if not acq_costs:
        current_app.logger.warning(f"No acquisition costs Property ID {property_id} not found or does not belong to user {firebase_uid}.")
        return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
    else:
        current_app.logger.info(f"Successfully retrieved acquisition costs database {property_id}. properties: {acq_costs}")
        
    financial_chars = PropertyFinancialsAndCharacteristic.query.filter_by(property_id=property_id).first()
    if not financial_chars:
        current_app.logger.warning(f"No property financials/characteristics found for property_id: {property_id}")
        return jsonify({"error": f"No property financials/characteristics found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved financial_characteristics database {property_id}. financial_characteristics: {financial_chars}")

    fin_assumptions = FinancialAssumption.query.filter_by(property_id=property_id).first()
    if not fin_assumptions:
        current_app.logger.warning(f"No property financial_assumptions found for property_id: {property_id}")
        return jsonify({"error": f"No property financial_assumptions found for Property ID: {property_id}"}), 404
    else:
        current_app.logger.info(f"Successfully retrieved financial_assumptions database {property_id}. financial_characteristics: {fin_assumptions}")

    def get_output2_yearly_values(category):
        value_entry = Output2.query.filter_by(property_id=property_id, category=category).first()
        if not value_entry:
            current_app.logger.warning(f"Missing CashFlowProjectionYearly data for property {property_id} and category '{category}'.")
            return [Decimal('0.0')] * 11 

        yearly_values = [
            value_entry.year_0,
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
            value_entry.year_11,
        ]
        return yearly_values
      
    def pv(rate, nper, pmt):
        """
        Calculates the Present Value (PV) of an annuity.
        This is a simplified implementation for this specific use case.
        """
        if rate == 0:
            return pmt * nper
        return pmt * (Decimal('1') - (Decimal('1') + rate)**-nper) / rate

    
    
    # Helper to format yearly data as [{"Year": X, "Value": Y}]
    # Helper to format yearly data as [{"Year": X, "Value": Y}]
    def format_yearly_data(data, start_year):
        return [{"Year": start_year + i, "Value": str(x)} for i, x in enumerate(data)]

    # Placeholder variables for direct database access, assuming a `decimal` or similar type
    acq_costs_purchase_price = Decimal(str(acq_costs.purchase_price))
    acq_costs_upfront_capex = Decimal(str(acq_costs.upfront_capex))
    acq_costs_due_diligence_costs = Decimal(str(acq_costs.due_diligence_costs))
    acq_costs_selling_cost_at_exit = Decimal(str(acq_costs.selling_cost_at_exit))
    fin_assumptions_loan_to_value = Decimal(str(fin_assumptions.loan_to_value))
    fin_assumptions_lender_fees = Decimal(str(fin_assumptions.lender_fees))
    fin_assumptions_interest_rate_fin_assumptions = Decimal(str(fin_assumptions.interest_rate_fin_assumptions))
    fin_assumptions_loan_period = Decimal(str(fin_assumptions.amortization_period))
    fin_assumptions_amortization_period = Decimal(str(fin_assumptions.amortization_period))
    financial_chars_exit_cap_rate_growth = Decimal(str(financial_chars.exit_cap_rate_growth))
    financial_chars_market_cap_rate = Decimal(str(financial_chars.market_cap_rate))
    financial_chars_analysis_period = Decimal(str(financial_chars.analysis_period))
    prop_data_square_footage = Decimal(str(prop_data.square_footage))
    fin_assumptions_years_interest_only = Decimal(str(fin_assumptions.years_interest_only))
    
    if financial_chars_analysis_period > 10:
      financial_chars_analysis_period = 10
    
    # 1. Initial Acquisition and Loan Calculations
    # purchase_price = acq_costs_purchase_price
    # upfront_capex = acq_costs_upfront_capex
    # due_diligence_closing = acq_costs_due_diligence_costs / Decimal('100') * purchase_price
    # total_acq_costs = purchase_price + upfront_capex + due_diligence_closing
    
    # loan_amount = purchase_price * fin_assumptions_loan_to_value / Decimal('100')
    # loan_fees = (loan_amount * fin_assumptions_lender_fees / Decimal('100')) * Decimal('-1')
    # net_loan_funding = loan_amount + loan_fees
    
    purchase_price_array = [acq_costs_purchase_price if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    upfront_capex_array = [acq_costs_upfront_capex if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    due_diligence_closing_array = [acq_costs_due_diligence_costs / Decimal('100') * purchase_price_array[0] if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    total_acq_costs_array = [purchase_price_array[i] + upfront_capex_array[i] + due_diligence_closing_array[i] for i in range(int(financial_chars_analysis_period) + 2)]
    
    loan_amount_array = [acq_costs_purchase_price * fin_assumptions_loan_to_value / Decimal('100') if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    loan_fees_array = [(loan_amount_array[0] * fin_assumptions_lender_fees / Decimal('100')) * Decimal('-1') if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    net_loan_funding_array = [loan_amount_array[i] + loan_fees_array[i] for i in range(int(financial_chars_analysis_period) + 2)]

    # Use the Year 0 values for calculations that previously used the single variables
    total_acq_costs = total_acq_costs_array[0]
    loan_amount = loan_amount_array[0]
    net_loan_funding = net_loan_funding_array[0]
    
    # 2. Annual Financial Performance Calculations (Years 1-11)
    EGR = [Decimal(str(v)) for v in get_output2_yearly_values("EGR")]
    OPEX = [Decimal(str(v)) for v in get_output2_yearly_values("Opex")]
    CAPEX = [Decimal(str(v)) for v in get_output2_yearly_values("Capital Expenditures")] 
    
    effective_gross_revenue = EGR[1:] # Drop Year 0
    operating_expenses = OPEX[1:] # Drop Year 0
    capital_expenditures = CAPEX[1:] # Drop Year 0

    net_operating_income = [egr - opex for egr, opex in zip(effective_gross_revenue, operating_expenses)]
    cfo = [noi - capex for noi, capex in zip(net_operating_income, capital_expenditures)]

    # 3. Calculation for constant debt_service
    interest_rate_monthly = fin_assumptions_interest_rate_fin_assumptions / Decimal('100') / Decimal('12')
    loan_period_months = fin_assumptions_amortization_period * Decimal('12')
    
    # debt_service_monthly_pmt = loan_amount * (interest_rate_monthly * (Decimal('1') + interest_rate_monthly)**loan_period_months) / ((Decimal('1') + interest_rate_monthly)**loan_period_months - Decimal('1'))
    # debt_service = [debt_service_monthly_pmt * Decimal('12')] * 10

    # for debt_service calculations
    
    # Calculate loan-related variables
    loan_amount = acq_costs_purchase_price * fin_assumptions_loan_to_value / Decimal('100')
    
    # Calculate the annual amortizing payment
    interest_rate_monthly = fin_assumptions_interest_rate_fin_assumptions / Decimal('100') / Decimal('12')
    loan_period_months = fin_assumptions_amortization_period * Decimal('12')
    
    # Ensure denominator is not zero before calculation
    denominator = (Decimal('1') + interest_rate_monthly)**loan_period_months - Decimal('1')
    if denominator == 0:
        # Handle the case of zero interest rate to avoid division by zero
        annual_amortizing_payment = loan_amount / fin_assumptions_amortization_period
    else:
        debt_service_monthly_pmt = loan_amount * (interest_rate_monthly * (Decimal('1') + interest_rate_monthly)**loan_period_months) / denominator
        annual_amortizing_payment = debt_service_monthly_pmt * Decimal('12')
    
    # Calculate the annual interest-only payment
    annual_io_payment = loan_amount * (fin_assumptions_interest_rate_fin_assumptions / Decimal('100'))
    
    # 2. Build the debt_service array with conditional logic
    debt_service = []
    # Assuming 'years_interest_only' is a variable from your financial assumptions
    years_interest_only = int(fin_assumptions.years_interest_only) 
    
    for year_num in range(1, 11):
        # The logic: IF(year_num <= years_interest_only, annual_io_payment, annual_amortizing_payment)
        # The first part of your requested Excel logic "if year_num + 1 = "", "" " doesn't translate directly
        # to Python in a meaningful way here, as year_num will always be a number.
        if year_num <= years_interest_only:
            debt_service.append(annual_io_payment)
        else:
            debt_service.append(annual_amortizing_payment)
            
    print(f"Debt service: {debt_service}")
    print(f"annual_io_payment: {annual_io_payment}")
    print(f"annual_amortizing_payment: {annual_amortizing_payment}")
    print(f"loan_amount: {loan_amount}")
    


    # 4. Cash flow after financing
    cash_flow_after_financing = [cfo_val - ds for cfo_val, ds in zip(cfo, debt_service)]

    # 5. Exit & Reversion Calculations (Years 1-11)
    cap_rate_at_sale = []
    gross_sales_price = []
    exit_cap_rate_growth_decimal = (financial_chars_exit_cap_rate_growth / Decimal('10000')).quantize(Decimal('0.0001'))
    
    for i in range(11):
      if i == 0:
          cap_rate = financial_chars_market_cap_rate / Decimal('100')
          cap_rate_at_sale.append(cap_rate)
      else:
          cap_rate = (cap_rate_at_sale[i - 1] + exit_cap_rate_growth_decimal).quantize(Decimal('0.0001'))
          cap_rate_at_sale.append(cap_rate)

    # Corrected loop to iterate only over the 10 years of available data (indices 0-9)
    for i in range(10): 
        if cap_rate_at_sale[i] > 0: 
            sales_price = net_operating_income[i] / cap_rate_at_sale[i]
            gross_sales_price.append(sales_price)
        else:
            gross_sales_price.append(Decimal('0.0'))

    selling_costs = [price * acq_costs_selling_cost_at_exit / Decimal('100') for price in gross_sales_price]
    net_sales_proceeds = [price - cost for price, cost in zip(gross_sales_price, selling_costs)]
    net_sales_price_psf = [price / prop_data_square_footage for price in gross_sales_price]
    
    # loan_payoff = []
    # for year_num in range(1, 11):
    #     remaining_loan_period_months = (fin_assumptions_amortization_period - Decimal(str(year_num))) * Decimal('12')
    #     if remaining_loan_period_months <= 0:
    #         payoff = Decimal('0')
    #     else:
    #         payoff = pv(interest_rate_monthly, remaining_loan_period_months, debt_service_monthly_pmt)
    #     loan_payoff.append(payoff)
    
    # This is a basic PV function to match the logic.
    # A more robust solution might use a dedicated financial library.
    
    interest_rate = fin_assumptions_interest_rate_fin_assumptions / 100
    
    
    def pv(rate, nper, pmt):
        if rate == 0:
            return -pmt * nper
        else:
            # Using the standard present value formula
            return pmt * (Decimal('1') - (Decimal('1') + rate)**(-nper)) / rate

    loan_payoff = []
    for year_num in range(1, 11):
        # This part handles the "IF(year3="",..." logic
        # In a loop from 1 to 10, this is always true.
        if year_num < 11:
            # Calculate PV using the new equation
            rate_monthly = interest_rate / Decimal('12')
            nper_calc = (fin_assumptions_amortization_period + years_interest_only - Decimal(str(year_num))) * Decimal('12')
            pmt_monthly = annual_amortizing_payment / Decimal('12')

            pv_calc = pv(rate_monthly, nper_calc, pmt_monthly)

            # Apply the main equation logic
            if Decimal(str(year_num)) <= years_interest_only:
                payoff = loan_amount
            else:
                payoff = pv_calc
        else:
            payoff = Decimal('0')  # Or whatever the logic is for later years
        
        loan_payoff.append(payoff)

    # To see the results
    for i, payoff_amount in enumerate(loan_payoff):
        print(f"Loan Payoff Year {i+1}: ${payoff_amount:,.2f}")

    # 6. Unlevered Cash Flow & Return Metrics
    # analysis_period = 10
    
    # Calculate Unlevered Cash Flows
    unlevered_investment_cash_flow = [Decimal('0')] * 11
    unlevered_operating_cash_flow = [Decimal('0')] * 11
    unlevered_reversion_cash_flow = [Decimal('0')] * 11
    
    unlevered_investment_cash_flow[0] = -(total_acq_costs)
    unlevered_operating_cash_flow[0] = Decimal('0')
    unlevered_reversion_cash_flow[0] = Decimal('0')

    for i in range(1, 11):
        unlevered_investment_cash_flow[i] = Decimal('0')
        unlevered_operating_cash_flow[i] = cfo[i-1]
        unlevered_reversion_cash_flow[i] = Decimal('0')

    unlevered_reversion_cash_flow[int(financial_chars_analysis_period)] = net_sales_proceeds[int(financial_chars_analysis_period)-1]

    net_unlevered_cash_flow = [unlevered_investment_cash_flow[0]] + [
        unlevered_operating_cash_flow[i] + unlevered_reversion_cash_flow[i] 
        for i in range(1, 11)
    ]
    
    # Free and Clear Returns
    free_and_clear_return = [cfo_val / total_acq_costs if total_acq_costs != 0 else Decimal('0') for cfo_val in cfo]
    avg_free_and_clear_return = []
    current_sum = Decimal('0')
    for i, value in enumerate(free_and_clear_return):
        current_sum += value
        avg = current_sum / Decimal(str(i + 1))
        avg_free_and_clear_return.append(avg)
    unlevered_irr = npf.irr(net_unlevered_cash_flow)
    sum_positive_unlevered = sum(cf for cf in net_unlevered_cash_flow if cf > 0)
    sum_negative_unlevered = sum(cf for cf in net_unlevered_cash_flow if cf < 0)
    unlevered_equity_multiple = sum_positive_unlevered / abs(sum_negative_unlevered) if sum_negative_unlevered != 0 else Decimal('0')

    # 7. Levered Cash Flow & Return Metrics
    levered_investment_cash_flow = [Decimal('0')] * 11
    levered_operating_cash_flow = [Decimal('0')] * 11
    levered_reversion_cash_flow = [Decimal('0')] * 11

    levered_investment_cash_flow[0] = -(total_acq_costs - net_loan_funding)
    levered_operating_cash_flow[0] = Decimal('0')
    levered_reversion_cash_flow[0] = Decimal('0')
    
    for i in range(1, 11):
        levered_investment_cash_flow[i] = Decimal('0')
        levered_operating_cash_flow[i] = cash_flow_after_financing[i-1]
        levered_reversion_cash_flow[i] = Decimal('0')
    
    levered_reversion_cash_flow[int(financial_chars_analysis_period)] = net_sales_proceeds[int(financial_chars_analysis_period)-1] - loan_payoff[int(financial_chars_analysis_period)-1]
    
    net_levered_cash_flow = [levered_investment_cash_flow[0]] + [
        levered_operating_cash_flow[i] + levered_reversion_cash_flow[i] 
        for i in range(1, 11)
    ]
    
    # Cash-on-Cash Return
    cash_on_cash_return = []
    coc_denom = total_acq_costs - net_loan_funding
    if coc_denom == 0: coc_denom = Decimal('1')
    for i in range(10): # Years 1-10
        coc = (cash_flow_after_financing[i] / coc_denom)
        cash_on_cash_return.append(coc)

    avg_cash_on_cash_return = []
    current_sum_coc = Decimal('0')
    for i, value in enumerate(cash_on_cash_return):
        current_sum_coc += value
        avg_coc = current_sum_coc / Decimal(str(i + 1))
        avg_cash_on_cash_return.append(avg_coc)
        
        
    


    levered_irr = npf.irr(net_levered_cash_flow)
    sum_positive_levered = sum(cf for cf in net_levered_cash_flow if cf > 0)
    sum_negative_levered = sum(cf for cf in net_levered_cash_flow if cf < 0)
    levered_equity_multiple = sum_positive_levered / abs(sum_negative_levered) if sum_negative_levered != 0 else Decimal('0')

    # 8. Debt Metrics (Years 1-10)
    debt_coverage_ratio_noi = [noi / ds if ds != 0 else Decimal('0') for noi, ds in zip(net_operating_income, debt_service)]
    debt_yield_noi = [noi / payoff if payoff != 0 else Decimal('0') for noi, payoff in zip(net_operating_income, loan_payoff)]

    # 9. IRR Calculation Matrices
    # unlevered_irr_calc_matrix = {}
    # for y_year in range(11):
    #     year_data = {"Year Ending": y_year}
    #     for x_year in range(11):
    #         if x_year == 0 and y_year == 0:
    #             year_data[str(x_year)] = str(unlevered_investment_cash_flow[y_year])
    #         elif x_year <= y_year:
    #             if x_year == y_year:
    #                 year_data[str(x_year)] = str(unlevered_operating_cash_flow[y_year] + unlevered_reversion_cash_flow[y_year])
    #             else:
    #                 year_data[str(x_year)] = str(unlevered_operating_cash_flow[y_year])
    #         else:
    #             year_data[str(x_year)] = str(Decimal('0'))
    #     unlevered_irr_calc_matrix[f"Year {y_year}"] = year_data
        
    # levered_irr_calc_matrix = {}
    # for y_year in range(11):
    #     year_data = {"Year Ending": y_year}
    #     for x_year in range(11):
    #         if x_year == 0 and y_year == 0:
    #             year_data[str(x_year)] = str(levered_investment_cash_flow[y_year])
    #         elif x_year <= y_year:
    #             if x_year == y_year:
    #                 year_data[str(x_year)] = str(levered_operating_cash_flow[y_year] + levered_reversion_cash_flow[y_year])
    #             else:
    #                 year_data[str(x_year)] = str(levered_operating_cash_flow[y_year])
    #         else:
    #             year_data[str(x_year)] = str(Decimal('0'))
    #     levered_irr_calc_matrix[f"Year {y_year}"] = year_data
    
    # Ensure net_sales_proceeds and loan_payoff arrays have been calculated
    # ... your existing code for calculating net_sales_proceeds and loan_payoff ...

    # The reversion cash flows should be populated for every possible exit year.
    # The arrays are sized to 11 to include a placeholder for Year 0.
    matrix_unlevered_reversion_cash_flow = unlevered_reversion_cash_flow
    matrix_levered_reversion_cash_flow = levered_reversion_cash_flow
    
    matrix_unlevered_reversion_cash_flow = [Decimal('0')] * 11
    matrix_levered_reversion_cash_flow = [Decimal('0')] * 11
    
    # This loop populates the reversion value for each year from 1 to 10.
    # We use 'i+1' for the index to align with the year number.
    for i in range(10): # Corresponds to net_sales_proceeds indices 0-9
        matrix_unlevered_reversion_cash_flow[i+1] = net_sales_proceeds[i]
        
        # Ensure loan_payoff has been correctly calculated and is of the same size.
        matrix_levered_reversion_cash_flow[i+1] = net_sales_proceeds[i] - loan_payoff[i]
    
    
    def generate_irr_matrix(investment_cf, operating_cf, reversion_cf):
        matrix = {}
        for y_year in range(11):
            year_data = {"Year Ending": y_year}

            # Step 1: Build the cash flow stream for the current holding period (up to y_year)
            # The initial investment is always year 0.
            current_cash_flows = [investment_cf[0]]
            for i in range(1, y_year + 1):
                if i == y_year:
                    # This is the final year of the holding period, so we include reversion cash flow.
                    cash_flow = operating_cf[i] + reversion_cf[i]
                else:
                    # Intermediate years only include operating cash flow.
                    cash_flow = operating_cf[i]
                current_cash_flows.append(cash_flow)

            # Step 2: Calculate the IRR for this cash flow stream
            if y_year == 0:
                year_data["IRR"] = ""
            else:
                cf_float = [float(cf) for cf in current_cash_flows]
                try:
                    irr_value = npf.irr(cf_float)
                    # Check for unrealistic returns or NaNs
                    if irr_value > -1.0 and irr_value < 100.0:  # Simple check to avoid outliers
                        year_data["IRR"] = f"{irr_value:.4%}"
                    else:
                        year_data["IRR"] = "N/A"
                except (ValueError, IndexError):
                    year_data["IRR"] = "N/A"

            # Step 3: Populate the matrix row with the correct cash flow values
            for x_year in range(11):
                if x_year == 0:
                    # Initial investment, always negative.
                    year_data[str(x_year)] = str(investment_cf[0])
                elif 1 <= x_year <= y_year:
                    # Cash flows for the years within the current holding period.
                    if x_year == y_year:
                        year_data[str(x_year)] = str(operating_cf[x_year] + reversion_cf[x_year])
                    else:
                        year_data[str(x_year)] = str(operating_cf[x_year])
                else:
                    # Years outside the current holding period are blank.
                    year_data[str(x_year)] = ""

            matrix[f"Year {y_year}"] = year_data
        return matrix

    # Generate the unlevered and levered IRR matrices
    unlevered_irr_calc_matrix = generate_irr_matrix(unlevered_investment_cash_flow, unlevered_operating_cash_flow, matrix_unlevered_reversion_cash_flow)
    levered_irr_calc_matrix = generate_irr_matrix(levered_investment_cash_flow, levered_operating_cash_flow, matrix_levered_reversion_cash_flow)

    # You can print the results to see the matrices.
    import json
    print("Unlevered IRR Matrix:")
    print(json.dumps(unlevered_irr_calc_matrix, indent=4))
    print("\nLevered IRR Matrix:")
    print(json.dumps(levered_irr_calc_matrix, indent=4))

          
    # Final structured output
    results = {
        "Purchase Price": format_yearly_data(purchase_price_array, 0),
        "Upfront CapEx": format_yearly_data(upfront_capex_array, 0),
        "Due Dilligence + Closing Cost": format_yearly_data(due_diligence_closing_array, 0),
        "Total Acquisition Costs": format_yearly_data(total_acq_costs_array, 0),
        "Loan Amount": format_yearly_data(loan_amount_array, 0),
        "Loan Fees": format_yearly_data(loan_fees_array, 0),
        "Net Loan Funding": format_yearly_data(net_loan_funding_array, 0),
        "Effective Gross Revenue": format_yearly_data(effective_gross_revenue, 1),
        "Operating Expenses": format_yearly_data(operating_expenses, 1),
        "Net Operating Income": format_yearly_data(net_operating_income, 1),
        "Capital Expenditures": format_yearly_data(capital_expenditures, 1),
        "Cash Flow From Operations": format_yearly_data(cfo, 1),
        "Debt Service": format_yearly_data(debt_service, 1),
        "Cash Flow after Financing": format_yearly_data(cash_flow_after_financing, 1),
        "Cap Rate at Sale (%)": format_yearly_data(cap_rate_at_sale, 1),
        "Gross Sales Price": format_yearly_data(gross_sales_price, 1),
        "Selling Costs": format_yearly_data(selling_costs, 1),
        "Net Sales Proceeds": format_yearly_data(net_sales_proceeds, 1),
        "Net Sales Price PSF": format_yearly_data(net_sales_price_psf, 1),
        "Loan Payoff": format_yearly_data(loan_payoff, 1),
        "Unlevered Investment Cash Flow": format_yearly_data(unlevered_investment_cash_flow, 0),
        "Unlevered Operating Cash Flow": format_yearly_data(unlevered_operating_cash_flow, 0),
        "Unlevered Reversion Cash Flow": format_yearly_data(unlevered_reversion_cash_flow, 0),
        "Unlevered Net Unlevered Cash Flow": format_yearly_data(net_unlevered_cash_flow, 0),
        "Free and Clear Return (%)": format_yearly_data(free_and_clear_return, 1),
        "Avg. Free and Clear Return (%)": format_yearly_data(avg_free_and_clear_return, 1),
        "Unlevered IRR (%)": str(unlevered_irr),
        "Unlevered Equity Multiple": str(unlevered_equity_multiple),
        "Levered Investment Cash Flow": format_yearly_data(levered_investment_cash_flow, 0),
        "Levered Operating Cash Flow": format_yearly_data(levered_operating_cash_flow, 0),
        "Levered Reversion Cash Flow": format_yearly_data(levered_reversion_cash_flow, 0),
        "Levered Net Unlevered Cash Flow": format_yearly_data(net_levered_cash_flow, 0),
        "Cash-on-Cash Return (%)": format_yearly_data(cash_on_cash_return, 1),
        "Avg. Cash-on-Cash Return (%)": format_yearly_data(avg_cash_on_cash_return, 1),
        "Levered IRR (%)": str(levered_irr),
        "Levered Equity Multiple": str(levered_equity_multiple),
        "Debt Coverage Ratio (NOI)": format_yearly_data(debt_coverage_ratio_noi, 1),
        "Debt Yield (NOI) (%)": format_yearly_data(debt_yield_noi, 1),
        "Unlevered Internal Rate of Return Calculation": unlevered_irr_calc_matrix,
        "Levered Internal Rate of Return Calculation": levered_irr_calc_matrix
    }
    
    def convert_to_decimal(value):
      """
      Safely converts a value to a Decimal, handling empty strings or None.
      Returns None if conversion fails.
      """
      if value is None or value == '':
          return None
      try:
          # Convert to Decimal without rounding
          d = decimal.Decimal(str(value))
          return d
      except (decimal.InvalidOperation, ValueError):
          return None
    
    # Process the main categories
    for category, data in results.items():
        # Skip matrix data as it is processed separately
        if "Internal Rate of Return Calculation" in category:
            continue
        
        entry = Output3.query.filter_by(property_id=property_id, category=category).first()
        if not entry:
            entry = Output3(property_id=property_id, category=category)
            db.session.add(entry)

        # Reset all year columns to None to ensure data integrity
        for i in range(12):  # Use range(12) to cover year_0 to year_11
            setattr(entry, f'year_{i}', None)
        entry.other = None

        # Handle a list of dictionaries with 'Year' and 'Value' keys
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'Value' in item and 'Year' in item:
                    try:
                        year_num = int(item['Year'])
                        value = convert_to_decimal(item['Value'])
                        if 0 <= year_num <= 11:
                            setattr(entry, f'year_{year_num}', value)
                        else:
                            print(f"Warning: Year {year_num} out of range for category {category}")
                    except (ValueError, KeyError):
                        print(f"Warning: Missing or invalid 'Year' or 'Value' key in item for category {category}")

        # Handle a single string or number value (for things like Levered IRR)
        elif isinstance(data, (str, float, int)):
            entry.other = convert_to_decimal(data)
        
        # Handle dictionary-based data with explicit year keys (e.g. IRR calculations)
        # This part of the code is now mostly for the specific IRR format
        elif isinstance(data, dict):
            # This is a bit of a catch-all, but handles cases like the IRR summary
            # where the data isn't a list but has year keys.
            for key, value in data.items():
                if key.startswith('Year '):
                    try:
                        year_num = int(key.replace('Year ', ''))
                        if 0 <= year_num <= 11:
                            setattr(entry, f'year_{year_num}', convert_to_decimal(value))
                    except (ValueError, IndexError):
                        pass # Ignore keys that don't match the 'Year X' format
                else:
                    entry.other = convert_to_decimal(value)
        else:
            print(f"Warning: Unhandled data type for category {category}")

    # Process the matrix data separately as it has a unique structure
    for matrix_category in ["Unlevered Internal Rate of Return Calculation", "Levered Internal Rate of Return Calculation"]:
        matrix = results.get(matrix_category)
        if not matrix:
            continue

        # Get a list of years from the matrix keys (e.g., "Year 0", "Year 1", ...)
        sorted_years = sorted(matrix.keys(), key=lambda x: int(x.split(' ')[1]))

        # Process and store the data for each year
        for y_key in sorted_years:
            row_data = matrix[y_key]
            # Create a unique category for each year's data
            category = f"{matrix_category} - {y_key}"
            entry = Output3.query.filter_by(property_id=property_id, category=category).first()
            if not entry:
                entry = Output3(property_id=property_id, category=category)
                db.session.add(entry)
            
            # Reset year columns before storing new values
            for i in range(11):
                setattr(entry, f'year_{i}', None)
            
            # Store the yearly Net Cash Flow values in the corresponding columns
            for i in range(11):
                value = row_data.get(str(i))
                if value is not None and value != "":
                    setattr(entry, f'year_{i}', convert_to_decimal(value))
            
            irr_value = row_data.get("IRR", None)
            print(irr_value)
            setattr(entry, f'other', convert_to_decimal(irr_value))
            entry.other = irr_value
            # Store the cumulative IRR for the given year in the 'other' column


    # Commit the session to save all changes
    db.session.commit()

    return results

  except ValueError:
      current_app.logger.error("Invalid ID Token format.", exc_info=True)
      return jsonify({"error": "Invalid ID Token format."}), 401
  except Exception as e:
      current_app.logger.error(f"Error during Firebase ID Token verification: {e}", exc_info=True)
      return jsonify({"error": "Authentication failed.", "details": str(e)}), 401

def calculate_output3_fast(property_id, input_data, output2_data):
    
    cashflow_inputs_list = input_data.get('cashflow_inputs', [])
    tenant_profile_yearly_list = input_data.get('tenant_profile_yearly', [])
    prop_data = input_data.get('property')
    operating_data = input_data.get('operating_data')
    financial_chars = input_data.get('financial_chars')
    acq_costs = input_data.get('acq_costs')
    fin_assumptions = input_data.get('financial_assumptions')
    
    output2_projections = output2_data.get('projections', [])
    
    def get_output2_yearly_values(category):
        projection = output2_projections[category]
        yearly_values = []
        for i in range(0, 12):  # Loop from Year 1 to Year 11
            year_key = f'Year {i}'
            # Get the value for the specific year, defaulting to 0 if not found
            value = projection.get(year_key, 0)
            yearly_values.append(value)
        return yearly_values
  
    def pv(rate, nper, pmt):
        """
        Calculates the Present Value (PV) of an annuity.
        This is a simplified implementation for this specific use case.
        """
        if rate == 0:
            return pmt * nper
        return pmt * (Decimal('1') - (Decimal('1') + rate)**-nper) / rate

    
    
    # Helper to format yearly data as [{"Year": X, "Value": Y}]
    # Helper to format yearly data as [{"Year": X, "Value": Y}]
    def format_yearly_data(data, start_year):
        return [{"Year": start_year + i, "Value": str(x)} for i, x in enumerate(data)]

    # Placeholder variables for direct database access, assuming a `decimal` or similar type
    acq_costs_purchase_price = Decimal(str(acq_costs.purchase_price))
    acq_costs_upfront_capex = Decimal(str(acq_costs.upfront_capex))
    acq_costs_due_diligence_costs = Decimal(str(acq_costs.due_diligence_costs))
    acq_costs_selling_cost_at_exit = Decimal(str(acq_costs.selling_cost_at_exit))
    fin_assumptions_loan_to_value = Decimal(str(fin_assumptions.loan_to_value))
    fin_assumptions_lender_fees = Decimal(str(fin_assumptions.lender_fees))
    fin_assumptions_interest_rate_fin_assumptions = Decimal(str(fin_assumptions.interest_rate_fin_assumptions))
    fin_assumptions_loan_period = Decimal(str(fin_assumptions.amortization_period))
    fin_assumptions_amortization_period = Decimal(str(fin_assumptions.amortization_period))
    financial_chars_exit_cap_rate_growth = Decimal(str(financial_chars.exit_cap_rate_growth))
    financial_chars_market_cap_rate = Decimal(str(financial_chars.market_cap_rate))
    financial_chars_analysis_period = Decimal(str(financial_chars.analysis_period))
    prop_data_square_footage = Decimal(str(prop_data.square_footage))
    fin_assumptions_years_interest_only = Decimal(str(fin_assumptions.years_interest_only))
    
    if financial_chars_analysis_period > 10:
      financial_chars_analysis_period = 10
    
    purchase_price_array = [acq_costs_purchase_price if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    upfront_capex_array = [acq_costs_upfront_capex if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    due_diligence_closing_array = [acq_costs_due_diligence_costs / Decimal('100') * purchase_price_array[0] if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    total_acq_costs_array = [purchase_price_array[i] + upfront_capex_array[i] + due_diligence_closing_array[i] for i in range(int(financial_chars_analysis_period) + 2)]
    
    loan_amount_array = [acq_costs_purchase_price * fin_assumptions_loan_to_value / Decimal('100') if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    loan_fees_array = [(loan_amount_array[0] * fin_assumptions_lender_fees / Decimal('100')) * Decimal('-1') if i == 0 else Decimal('0') for i in range(int(financial_chars_analysis_period) + 2)]
    net_loan_funding_array = [loan_amount_array[i] + loan_fees_array[i] for i in range(int(financial_chars_analysis_period) + 2)]

    # Use the Year 0 values for calculations that previously used the single variables
    total_acq_costs = total_acq_costs_array[0]
    loan_amount = loan_amount_array[0]
    net_loan_funding = net_loan_funding_array[0]
    
    # 2. Annual Financial Performance Calculations (Years 1-11)
    EGR = [Decimal(str(v)) for v in get_output2_yearly_values("EGR")]
    OPEX = [Decimal(str(v)) for v in get_output2_yearly_values("Opex")]
    CAPEX = [Decimal(str(v)) for v in get_output2_yearly_values("Capital Expenditures")] 
    
    effective_gross_revenue = EGR[1:] # Drop Year 0
    operating_expenses = OPEX[1:] # Drop Year 0
    capital_expenditures = CAPEX[1:] # Drop Year 0

    net_operating_income = [egr - opex for egr, opex in zip(effective_gross_revenue, operating_expenses)]
    cfo = [noi - capex for noi, capex in zip(net_operating_income, capital_expenditures)]

    # 3. Calculation for constant debt_service
    interest_rate_monthly = fin_assumptions_interest_rate_fin_assumptions / Decimal('100') / Decimal('12')
    loan_period_months = fin_assumptions_amortization_period * Decimal('12')
    
    # Calculate loan-related variables
    loan_amount = acq_costs_purchase_price * fin_assumptions_loan_to_value / Decimal('100')
    
    # Calculate the annual amortizing payment
    interest_rate_monthly = fin_assumptions_interest_rate_fin_assumptions / Decimal('100') / Decimal('12')
    loan_period_months = fin_assumptions_amortization_period * Decimal('12')
    
    # Ensure denominator is not zero before calculation
    denominator = (Decimal('1') + interest_rate_monthly)**loan_period_months - Decimal('1')
    if denominator == 0:
        # Handle the case of zero interest rate to avoid division by zero
        annual_amortizing_payment = loan_amount / fin_assumptions_amortization_period
    else:
        debt_service_monthly_pmt = loan_amount * (interest_rate_monthly * (Decimal('1') + interest_rate_monthly)**loan_period_months) / denominator
        annual_amortizing_payment = debt_service_monthly_pmt * Decimal('12')
    
    # Calculate the annual interest-only payment
    annual_io_payment = loan_amount * (fin_assumptions_interest_rate_fin_assumptions / Decimal('100'))
    
    # 2. Build the debt_service array with conditional logic
    debt_service = []
    # Assuming 'years_interest_only' is a variable from your financial assumptions
    years_interest_only = int(fin_assumptions.years_interest_only) 
    
    for year_num in range(1, 11):
        # The logic: IF(year_num <= years_interest_only, annual_io_payment, annual_amortizing_payment)
        # The first part of your requested Excel logic "if year_num + 1 = "", "" " doesn't translate directly
        # to Python in a meaningful way here, as year_num will always be a number.
        if year_num <= years_interest_only:
            debt_service.append(annual_io_payment)
        else:
            debt_service.append(annual_amortizing_payment)
            
    # print(f"Debt service: {debt_service}")
    # print(f"annual_io_payment: {annual_io_payment}")
    # print(f"annual_amortizing_payment: {annual_amortizing_payment}")
    # print(f"loan_amount: {loan_amount}")
    


    # 4. Cash flow after financing
    cash_flow_after_financing = [cfo_val - ds for cfo_val, ds in zip(cfo, debt_service)]

    # 5. Exit & Reversion Calculations (Years 1-11)
    cap_rate_at_sale = []
    gross_sales_price = []
    exit_cap_rate_growth_decimal = (financial_chars_exit_cap_rate_growth / Decimal('10000')).quantize(Decimal('0.0001'))
    
    for i in range(11):
      if i == 0:
          cap_rate = financial_chars_market_cap_rate / Decimal('100')
          cap_rate_at_sale.append(cap_rate)
      else:
          cap_rate = (cap_rate_at_sale[i - 1] + exit_cap_rate_growth_decimal).quantize(Decimal('0.0001'))
          cap_rate_at_sale.append(cap_rate)

    # Corrected loop to iterate only over the 10 years of available data (indices 0-9)
    for i in range(10): 
        if cap_rate_at_sale[i] > 0: 
            sales_price = net_operating_income[i] / cap_rate_at_sale[i]
            gross_sales_price.append(sales_price)
        else:
            gross_sales_price.append(Decimal('0.0'))

    selling_costs = [price * acq_costs_selling_cost_at_exit / Decimal('100') for price in gross_sales_price]
    net_sales_proceeds = [price - cost for price, cost in zip(gross_sales_price, selling_costs)]
    net_sales_price_psf = [price / prop_data_square_footage for price in gross_sales_price]
    
    # loan_payoff = []
    # for year_num in range(1, 11):
    #     remaining_loan_period_months = (fin_assumptions_amortization_period - Decimal(str(year_num))) * Decimal('12')
    #     if remaining_loan_period_months <= 0:
    #         payoff = Decimal('0')
    #     else:
    #         payoff = pv(interest_rate_monthly, remaining_loan_period_months, debt_service_monthly_pmt)
    #     loan_payoff.append(payoff)
    
    # This is a basic PV function to match the logic.
    # A more robust solution might use a dedicated financial library.
    
    interest_rate = fin_assumptions_interest_rate_fin_assumptions / 100
    
    
    def pv(rate, nper, pmt):
        if rate == 0:
            return -pmt * nper
        else:
            # Using the standard present value formula
            return pmt * (Decimal('1') - (Decimal('1') + rate)**(-nper)) / rate

    loan_payoff = []
    for year_num in range(1, 11):
        # This part handles the "IF(year3="",..." logic
        # In a loop from 1 to 10, this is always true.
        if year_num < 11:
            # Calculate PV using the new equation
            rate_monthly = interest_rate / Decimal('12')
            nper_calc = (fin_assumptions_amortization_period + years_interest_only - Decimal(str(year_num))) * Decimal('12')
            pmt_monthly = annual_amortizing_payment / Decimal('12')

            pv_calc = pv(rate_monthly, nper_calc, pmt_monthly)

            # Apply the main equation logic
            if Decimal(str(year_num)) <= years_interest_only:
                payoff = loan_amount
            else:
                payoff = pv_calc
        else:
            payoff = Decimal('0')  # Or whatever the logic is for later years
        
        loan_payoff.append(payoff)

    # To see the results
    # for i, payoff_amount in enumerate(loan_payoff):
    #     print(f"Loan Payoff Year {i+1}: ${payoff_amount:,.2f}")

    # 6. Unlevered Cash Flow & Return Metrics
    # analysis_period = 10
    
    # Calculate Unlevered Cash Flows
    unlevered_investment_cash_flow = [Decimal('0')] * 11
    unlevered_operating_cash_flow = [Decimal('0')] * 11
    unlevered_reversion_cash_flow = [Decimal('0')] * 11
    
    unlevered_investment_cash_flow[0] = -(total_acq_costs)
    unlevered_operating_cash_flow[0] = Decimal('0')
    unlevered_reversion_cash_flow[0] = Decimal('0')

    for i in range(1, 11):
        unlevered_investment_cash_flow[i] = Decimal('0')
        unlevered_operating_cash_flow[i] = cfo[i-1]
        unlevered_reversion_cash_flow[i] = Decimal('0')

    unlevered_reversion_cash_flow[int(financial_chars_analysis_period)] = net_sales_proceeds[int(financial_chars_analysis_period)-1]

    net_unlevered_cash_flow = [unlevered_investment_cash_flow[0]] + [
        unlevered_operating_cash_flow[i] + unlevered_reversion_cash_flow[i] 
        for i in range(1, 11)
    ]
    
    # Free and Clear Returns
    free_and_clear_return = [cfo_val / total_acq_costs if total_acq_costs != 0 else Decimal('0') for cfo_val in cfo]
    avg_free_and_clear_return = []
    current_sum = Decimal('0')
    for i, value in enumerate(free_and_clear_return):
        current_sum += value
        avg = current_sum / Decimal(str(i + 1))
        avg_free_and_clear_return.append(avg)
    unlevered_irr = npf.irr(net_unlevered_cash_flow)
    sum_positive_unlevered = sum(cf for cf in net_unlevered_cash_flow if cf > 0)
    sum_negative_unlevered = sum(cf for cf in net_unlevered_cash_flow if cf < 0)
    unlevered_equity_multiple = sum_positive_unlevered / abs(sum_negative_unlevered) if sum_negative_unlevered != 0 else Decimal('0')

    # 7. Levered Cash Flow & Return Metrics
    levered_investment_cash_flow = [Decimal('0')] * 11
    levered_operating_cash_flow = [Decimal('0')] * 11
    levered_reversion_cash_flow = [Decimal('0')] * 11

    levered_investment_cash_flow[0] = -(total_acq_costs - net_loan_funding)
    levered_operating_cash_flow[0] = Decimal('0')
    levered_reversion_cash_flow[0] = Decimal('0')
    
    for i in range(1, 11):
        levered_investment_cash_flow[i] = Decimal('0')
        levered_operating_cash_flow[i] = cash_flow_after_financing[i-1]
        levered_reversion_cash_flow[i] = Decimal('0')
    
    levered_reversion_cash_flow[int(financial_chars_analysis_period)] = net_sales_proceeds[int(financial_chars_analysis_period)-1] - loan_payoff[int(financial_chars_analysis_period)-1]
    
    net_levered_cash_flow = [levered_investment_cash_flow[0]] + [
        levered_operating_cash_flow[i] + levered_reversion_cash_flow[i] 
        for i in range(1, 11)
    ]
    
    # Cash-on-Cash Return
    cash_on_cash_return = []
    coc_denom = total_acq_costs - net_loan_funding
    if coc_denom == 0: coc_denom = Decimal('1')
    for i in range(10): # Years 1-10
        coc = (cash_flow_after_financing[i] / coc_denom)
        cash_on_cash_return.append(coc)

    avg_cash_on_cash_return = []
    current_sum_coc = Decimal('0')
    for i, value in enumerate(cash_on_cash_return):
        current_sum_coc += value
        avg_coc = current_sum_coc / Decimal(str(i + 1))
        avg_cash_on_cash_return.append(avg_coc)
        
        
    


    levered_irr = npf.irr(net_levered_cash_flow)
    sum_positive_levered = sum(cf for cf in net_levered_cash_flow if cf > 0)
    sum_negative_levered = sum(cf for cf in net_levered_cash_flow if cf < 0)
    levered_equity_multiple = sum_positive_levered / abs(sum_negative_levered) if sum_negative_levered != 0 else Decimal('0')

    # 8. Debt Metrics (Years 1-10)
    debt_coverage_ratio_noi = [noi / ds if ds != 0 else Decimal('0') for noi, ds in zip(net_operating_income, debt_service)]
    debt_yield_noi = [noi / payoff if payoff != 0 else Decimal('0') for noi, payoff in zip(net_operating_income, loan_payoff)]

    matrix_unlevered_reversion_cash_flow = unlevered_reversion_cash_flow
    matrix_levered_reversion_cash_flow = levered_reversion_cash_flow
    
    matrix_unlevered_reversion_cash_flow = [Decimal('0')] * 11
    matrix_levered_reversion_cash_flow = [Decimal('0')] * 11
    
    # This loop populates the reversion value for each year from 1 to 10.
    # We use 'i+1' for the index to align with the year number.
    for i in range(10): # Corresponds to net_sales_proceeds indices 0-9
        matrix_unlevered_reversion_cash_flow[i+1] = net_sales_proceeds[i]
        
        # Ensure loan_payoff has been correctly calculated and is of the same size.
        matrix_levered_reversion_cash_flow[i+1] = net_sales_proceeds[i] - loan_payoff[i]
    
    
    def generate_irr_matrix(investment_cf, operating_cf, reversion_cf):
        matrix = {}
        for y_year in range(11):
            year_data = {"Year Ending": y_year}

            # Step 1: Build the cash flow stream for the current holding period (up to y_year)
            # The initial investment is always year 0.
            current_cash_flows = [investment_cf[0]]
            for i in range(1, y_year + 1):
                if i == y_year:
                    # This is the final year of the holding period, so we include reversion cash flow.
                    cash_flow = operating_cf[i] + reversion_cf[i]
                else:
                    # Intermediate years only include operating cash flow.
                    cash_flow = operating_cf[i]
                current_cash_flows.append(cash_flow)

            # Step 2: Calculate the IRR for this cash flow stream
            if y_year == 0:
                year_data["IRR"] = ""
            else:
                cf_float = [float(cf) for cf in current_cash_flows]
                try:
                    irr_value = npf.irr(cf_float)
                    # Check for unrealistic returns or NaNs
                    if irr_value > -1.0 and irr_value < 100.0:  # Simple check to avoid outliers
                        year_data["IRR"] = f"{irr_value:.4%}"
                    else:
                        year_data["IRR"] = "N/A"
                except (ValueError, IndexError):
                    year_data["IRR"] = "N/A"

            # Step 3: Populate the matrix row with the correct cash flow values
            for x_year in range(11):
                if x_year == 0:
                    # Initial investment, always negative.
                    year_data[str(x_year)] = str(investment_cf[0])
                elif 1 <= x_year <= y_year:
                    # Cash flows for the years within the current holding period.
                    if x_year == y_year:
                        year_data[str(x_year)] = str(operating_cf[x_year] + reversion_cf[x_year])
                    else:
                        year_data[str(x_year)] = str(operating_cf[x_year])
                else:
                    # Years outside the current holding period are blank.
                    year_data[str(x_year)] = ""

            matrix[f"Year {y_year}"] = year_data
        return matrix

    # Generate the unlevered and levered IRR matrices
    unlevered_irr_calc_matrix = generate_irr_matrix(unlevered_investment_cash_flow, unlevered_operating_cash_flow, matrix_unlevered_reversion_cash_flow)
    levered_irr_calc_matrix = generate_irr_matrix(levered_investment_cash_flow, levered_operating_cash_flow, matrix_levered_reversion_cash_flow)

    # You can print the results to see the matrices.
    # import json
    # print("Unlevered IRR Matrix:")
    # print(json.dumps(unlevered_irr_calc_matrix, indent=4))
    # print("\nLevered IRR Matrix:")
    # print(json.dumps(levered_irr_calc_matrix, indent=4))

          
    # Final structured output
    results = {
        "Purchase Price": format_yearly_data(purchase_price_array, 0),
        "Upfront CapEx": format_yearly_data(upfront_capex_array, 0),
        "Due Dilligence + Closing Cost": format_yearly_data(due_diligence_closing_array, 0),
        "Total Acquisition Costs": format_yearly_data(total_acq_costs_array, 0),
        "Loan Amount": format_yearly_data(loan_amount_array, 0),
        "Loan Fees": format_yearly_data(loan_fees_array, 0),
        "Net Loan Funding": format_yearly_data(net_loan_funding_array, 0),
        "Effective Gross Revenue": format_yearly_data(effective_gross_revenue, 1),
        "Operating Expenses": format_yearly_data(operating_expenses, 1),
        "Net Operating Income": format_yearly_data(net_operating_income, 1),
        "Capital Expenditures": format_yearly_data(capital_expenditures, 1),
        "Cash Flow From Operations": format_yearly_data(cfo, 1),
        "Debt Service": format_yearly_data(debt_service, 1),
        "Cash Flow after Financing": format_yearly_data(cash_flow_after_financing, 1),
        "Cap Rate at Sale (%)": format_yearly_data(cap_rate_at_sale, 1),
        "Gross Sales Price": format_yearly_data(gross_sales_price, 1),
        "Selling Costs": format_yearly_data(selling_costs, 1),
        "Net Sales Proceeds": format_yearly_data(net_sales_proceeds, 1),
        "Net Sales Price PSF": format_yearly_data(net_sales_price_psf, 1),
        "Loan Payoff": format_yearly_data(loan_payoff, 1),
        "Unlevered Investment Cash Flow": format_yearly_data(unlevered_investment_cash_flow, 0),
        "Unlevered Operating Cash Flow": format_yearly_data(unlevered_operating_cash_flow, 0),
        "Unlevered Reversion Cash Flow": format_yearly_data(unlevered_reversion_cash_flow, 0),
        "Unlevered Net Unlevered Cash Flow": format_yearly_data(net_unlevered_cash_flow, 0),
        "Free and Clear Return (%)": format_yearly_data(free_and_clear_return, 1),
        "Avg. Free and Clear Return (%)": format_yearly_data(avg_free_and_clear_return, 1),
        "Unlevered IRR (%)": str(unlevered_irr),
        "Unlevered Equity Multiple": str(unlevered_equity_multiple),
        "Levered Investment Cash Flow": format_yearly_data(levered_investment_cash_flow, 0),
        "Levered Operating Cash Flow": format_yearly_data(levered_operating_cash_flow, 0),
        "Levered Reversion Cash Flow": format_yearly_data(levered_reversion_cash_flow, 0),
        "Levered Net Unlevered Cash Flow": format_yearly_data(net_levered_cash_flow, 0),
        "Cash-on-Cash Return (%)": format_yearly_data(cash_on_cash_return, 1),
        "Avg. Cash-on-Cash Return (%)": format_yearly_data(avg_cash_on_cash_return, 1),
        "Levered IRR (%)": str(levered_irr),
        "Levered Equity Multiple": str(levered_equity_multiple),
        "Debt Coverage Ratio (NOI)": format_yearly_data(debt_coverage_ratio_noi, 1),
        "Debt Yield (NOI) (%)": format_yearly_data(debt_yield_noi, 1),
        "Unlevered Internal Rate of Return Calculation": unlevered_irr_calc_matrix,
        "Levered Internal Rate of Return Calculation": levered_irr_calc_matrix
    }
    
    print("output3: done with calculations, logging it to output")
    
    # existing_entries = db.session.query(Output3).filter_by(property_id=property_id).all()
    # entry_map = {entry.category: entry for entry in existing_entries}

    
    def convert_to_decimal(value):
      """
      Safely converts a value to a Decimal, handling empty strings or None.
      Returns None if conversion fails.
      """
      if value is None or value == '':
          return None
      try:
          # Convert to Decimal without rounding
          d = decimal.Decimal(str(value))
          return d
      except (decimal.InvalidOperation, ValueError):
          return None
    
    existing_entries_ids = db.session.query(Output3.category, Output3.id).filter_by(property_id=property_id).all()
    entry_id_map = {category: id for category, id in existing_entries_ids}
    
    updates = []
    inserts = []
    
    # --- Process Main Categories ---
    for category, data in results.items():
        if "Internal Rate of Return Calculation" in category:
            continue
        
        entry_data = {
            'property_id': property_id,
            'category': category
        }
        
        # Populate yearly and 'other' data
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'Value' in item and 'Year' in item:
                    try:
                        year_num = int(item['Year'])
                        value = convert_to_decimal(item['Value'])
                        if 0 <= year_num <= 11:
                            entry_data[f'year_{year_num}'] = value
                    except (ValueError, KeyError):
                        pass
        elif isinstance(data, (str, float, int, Decimal)):
            entry_data['other'] = convert_to_decimal(data)
        elif isinstance(data, dict):
            for key, value in data.items():
                if key.startswith('Year '):
                    try:
                        year_num = int(key.replace('Year ', ''))
                        if 0 <= year_num <= 11:
                            entry_data[f'year_{year_num}'] = convert_to_decimal(value)
                    except (ValueError, IndexError):
                        pass
                else:
                    entry_data['other'] = convert_to_decimal(value)
        
        # Check if we should update or insert
        if category in entry_id_map:
            entry_data['id'] = entry_id_map[category]
            updates.append(entry_data)
        else:
            inserts.append(Output3(**entry_data))
            
            
    print("output3: entering return calculator")
    # --- Process IRR Matrix Categories ---
    for matrix_category in ["Unlevered Internal Rate of Return Calculation", "Levered Internal Rate of Return Calculation"]:
        matrix = results.get(matrix_category)
        if not matrix:
            continue
        
        sorted_years = sorted(matrix.keys(), key=lambda x: int(x.split(' ')[1]))
        
        for y_key in sorted_years:
            row_data = matrix[y_key]
            category = f"{matrix_category} - {y_key}"
            
            entry_data = {
                'property_id': property_id,
                'category': category
            }
            
            for i in range(11):
                value = row_data.get(str(i))
                entry_data[f'year_{i}'] = convert_to_decimal(value)
            
            irr_value = row_data.get("IRR", None)
            entry_data['other'] = convert_to_decimal(irr_value)
            
            # Check if we should update or insert
            if category in entry_id_map:
                entry_data['id'] = entry_id_map[category]
                updates.append(entry_data)
            else:
                inserts.append(Output3(**entry_data))


    if updates:
        # Use bulk_update_mappings for updating existing records
        db.session.bulk_update_mappings(Output3, updates)
    if inserts:
        # Use bulk_save_objects for inserting new records
        db.session.bulk_save_objects(inserts)

    # Commit the session to save all changes
    db.session.commit()
    
    print("output3: done logging to output")

    return results
