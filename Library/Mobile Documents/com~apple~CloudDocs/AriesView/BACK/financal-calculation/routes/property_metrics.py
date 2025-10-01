from decimal import Decimal
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from firebase_admin import auth
from flasgger import swag_from
import numpy_financial as npf


from models import (
  db, FinancialAcquisitionCost, PropertyFinancialsAndCharacteristic,
  Property, Output3, PropertyMetrics
)

property_metrics_bp = Blueprint('property_metrics', __name__)

@property_metrics_bp.route('/property-metrics/<string:property_id>', methods=['POST'])
@cross_origin()
@swag_from({
    "tags": ["Output 1 - Property Metrics"],
    "parameters": [
        {
            "in": "path",
            "name": "property_id",
            "type": "string",
            "required": True,
            "description": "The UUID of the property to summarize."
        },
        {
            "in": "body",
            "name": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "idToken": {
                        "type": "string",
                        "description": "The Firebase authentication ID token (JWT) of the logged-in user."
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "Property summary data",
            "schema": {
                "type": "object",
                "properties": {
                    "Purchase Price": {"type": "number"},
                    "DCF Value": {"type": "number"},
                    "Replacement Cost": {"type": "number"},
                    "Unlevered IRR": {"type": "string"},
                    "Levered IRR": {"type": "string"},
                    "Unlevered Equity Multiple": {"type": "number"},
                    "Levered Equity Multiple": {"type": "number"},
                    "Avg. Free and Clear Return": {"type": "string"},
                    "Avg. Cash-on-Cash Return": {"type": "string"},
                    "Min. DSCR (NOI)": {"type": "string"},
                    "Min. Debt Yield (NOI)": {"type": "string"}
                }
            }
        },
        "400": {"description": "Bad request (e.g., idToken missing from body)."},
        "401": {"description": "Invalid or expired authentication token."},
        "404": {"description": "Property not found or access denied."},
        "500": {"description": "Internal server error."}
    }
})
def property_metrics_endpoint(property_id):
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
    
  metrics = property_metrics(property_id, firebase_uid)
  return metrics


def property_metrics(property_id, firebase_uid):
    
    print(f"Received request for property metrics. Property ID received: {property_id}")
    
    try:
        prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
        if not prop_data:
            current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
            return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
        else:
          current_app.logger.info(f"Successfully retrieved property database {property_id}. Prop_data: {prop_data}")
        
      
        acq_costs = FinancialAcquisitionCost.query.filter_by(property_id=property_id).first()
        if not acq_costs:
            current_app.logger.warning(f"No acquisition costs found for property_id: {property_id}")
            return jsonify({"error": f"No acquisition costs found for Property ID: {property_id}"}), 404
        else:
          current_app.logger.info(f"Successfully retrieved acquisitions database {property_id}. acquisitions: {acq_costs}")
        
        financial_chars = PropertyFinancialsAndCharacteristic.query.filter_by(property_id=property_id).first()
        if not financial_chars:
            current_app.logger.warning(f"No property financials/characteristics found for property_id: {property_id}")
            return jsonify({"error": f"No property financials/characteristics found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved financial_characteristics database {property_id}. financial_characteristics: {financial_chars}")

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process necessary data for calculation.", "details": str(e)}), 500

    net_unlevered_cash_flow_arr = []
    net_unlevered_cash_flow = Output3.query.filter_by(property_id=property_id, category="Unlevered Net Unlevered Cash Flow").first()
    if not net_unlevered_cash_flow:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Unlevered Net Unlevered Cash Flow")
      net_unlevered_cash_flow = [Decimal(0.0)]
    else:      
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_1))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_2))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_3))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_4))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_5))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_6))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_7))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_8))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_9))
      net_unlevered_cash_flow_arr.append(float(net_unlevered_cash_flow.year_10))
      
    
    def calculate_npv(rate, cash_flows):
      """
      Manually calculates the Net Present Value (NPV).
      
      Args:
          rate (float): The discount rate per period.
          initial_investment (float): The cash flow at time t=0 (e.g., a negative value for an outflow).
          cash_flows (list): A list of cash flows for periods 1 to n.
          
      Returns:
          float: The calculated Net Present Value.
      """
      npv = 0
      
      # Calculate the present value of each future cash flow
      for t, cf in enumerate(cash_flows, 1):
          npv += cf / (1 + rate)**t
                
      return npv
    
    net_unlevered_cash_flow_sum = float(net_unlevered_cash_flow.year_1) + float(net_unlevered_cash_flow.year_2) + float(net_unlevered_cash_flow.year_3) + float(net_unlevered_cash_flow.year_4) + float(net_unlevered_cash_flow.year_5) + float(net_unlevered_cash_flow.year_6) + float(net_unlevered_cash_flow.year_7) + float(net_unlevered_cash_flow.year_8) + float(net_unlevered_cash_flow.year_9) + float(net_unlevered_cash_flow.year_10)
    
    unlevered_irr_arr = Output3.query.filter_by(property_id=property_id, category="Unlevered IRR (%)").first()
    if not unlevered_irr_arr:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Unlevered IRR")
      
    unlevered_equity_multiple_arr = Output3.query.filter_by(property_id=property_id, category="Unlevered Equity Multiple").first()
    if not unlevered_equity_multiple_arr:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Unlevered Equity Multiple")
      
    avg_free_and_clear_return_arr = []
    avg_free_and_clear_return = Output3.query.filter_by(property_id=property_id, category="Avg. Free and Clear Return (%)").first()
    if not avg_free_and_clear_return:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Avg. Free and Clear Return")
    else:
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_1))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_2))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_3))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_4))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_5))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_6))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_7))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_8))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_9))
      avg_free_and_clear_return_arr.append(float(avg_free_and_clear_return.year_10))
      
    levered_irr_arr = Output3.query.filter_by(property_id=property_id, category="Levered IRR (%)").first()
    if not levered_irr_arr:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Levered IRR")
      
    levered_equity_multiple_arr = Output3.query.filter_by(property_id=property_id, category="Levered Equity Multiple").first()
    if not levered_equity_multiple_arr:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Levered Equity Multiple")
      
    analysis_period = float(financial_chars.analysis_period)
    
    avg_cash_on_cash_return_arr = []
    avg_cash_on_cash_return = Output3.query.filter_by(property_id=property_id, category="Avg. Cash-on-Cash Return (%)").first()
    if not avg_cash_on_cash_return:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Avg. Cash-on-Cash Return")
    else:
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_1))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_2))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_3))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_4))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_5))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_6))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_7))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_8))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_9))
      avg_cash_on_cash_return_arr.append(float(avg_cash_on_cash_return.year_10))
      
    debt_coverage_ratio_arr = []
    debt_coverage_ratio = Output3.query.filter_by(property_id=property_id, category="Debt Coverage Ratio (NOI)").first()
    if not debt_coverage_ratio:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Debt Coverage Ratio")
    else:
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_1))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_2))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_3))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_4))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_5))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_6))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_7))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_8))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_9))
      debt_coverage_ratio_arr.append(float(debt_coverage_ratio.year_10))
      
    debt_yield_noi_arr = []
    debt_yield_noi = Output3.query.filter_by(property_id=property_id, category="Debt Yield (NOI) (%)").first()
    if not debt_yield_noi:
      current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Debt Yield")
    else:
      debt_yield_noi_arr.append(float(debt_yield_noi.year_1))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_2))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_3))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_4))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_5))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_6))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_7))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_8))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_9))
      debt_yield_noi_arr.append(float(debt_yield_noi.year_10))
  
  
    # print(float(financial_chars.discount_rate) / 100)
    purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0
    dcf_value = calculate_npv(float(financial_chars.discount_rate) / 100, net_unlevered_cash_flow_arr) 
    replacement_cost = float(prop_data.psf) * float(prop_data.square_footage)
    unlevered_irr = float(unlevered_irr_arr.other) * 100
    unlevered_equity_multiple = float(unlevered_equity_multiple_arr.other)
    avg_free_and_clear_return = avg_free_and_clear_return_arr[int(analysis_period) - 1] * 100
    levered_irr = float(levered_irr_arr.other) * 100
    levered_equity_multiple = float(levered_equity_multiple_arr.other)
    avg_cash_on_cash_return = avg_cash_on_cash_return_arr[int(analysis_period) - 1] * 100
    min_dscr_noi = min(debt_coverage_ratio_arr)
    min_debt_yield_noi = min(debt_yield_noi_arr) * 100

    result = {
        "Purchase Price": purchase_price, # 
        "DCF Value": dcf_value,
        "Replacement Cost": replacement_cost,
        "Unlevered IRR": unlevered_irr,
        "Levered IRR": levered_irr,
        "Unlevered Equity Multiple": unlevered_equity_multiple,
        "Levered Equity Multiple": levered_equity_multiple,
        "Avg. Free and Clear Return": avg_free_and_clear_return,
        "Avg. Cash-on-Cash Return": avg_cash_on_cash_return,
        "Min. DSCR (NOI)": min_dscr_noi,
        "Min. Debt Yield (NOI)": min_debt_yield_noi
    }
    
    from decimal import Decimal, InvalidOperation

    # Safely convert to Decimal, handling None results from calculations
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value)) # Convert float to string first to avoid precision issues
        except InvalidOperation:
            return default
          
    property_metrics_entry = PropertyMetrics.query.filter_by(property_id=property_id).first()
    
    if property_metrics_entry:
      property_metrics_entry.purchase_price = to_decimal(result["Purchase Price"])
      property_metrics_entry.dcf_value = to_decimal(result["DCF Value"])
      property_metrics_entry.replacement_cost = to_decimal(result["Replacement Cost"])
      property_metrics_entry.unlevered_irr = to_decimal(result["Unlevered IRR"])
      property_metrics_entry.unlevered_equity_multiple = to_decimal(result["Unlevered Equity Multiple"])
      property_metrics_entry.avg_free_clear_return = to_decimal(result["Avg. Free and Clear Return"])
      property_metrics_entry.levered_irr = to_decimal(result["Levered IRR"])
      property_metrics_entry.levered_equity_multiple = to_decimal(result["Levered Equity Multiple"])
      property_metrics_entry.avg_cash_on_cash_return = to_decimal(result["Avg. Cash-on-Cash Return"])
      property_metrics_entry.min_dscr_noi = to_decimal(result["Min. DSCR (NOI)"])
      property_metrics_entry.min_debt_yield_noi = to_decimal(result["Min. Debt Yield (NOI)"])
    else:
      new_metrics = PropertyMetrics(
        property_id = property_id,
        purchase_price = to_decimal(result["Purchase Price"]),
        dcf_value = to_decimal(result["DCF Value"]),
        replacement_cost = to_decimal(result["Replacement Cost"]),
        unlevered_irr = to_decimal(result["Unlevered IRR"]),
        unlevered_equity_multiple = to_decimal(result["Unlevered Equity Multiple"]),
        avg_free_clear_return = to_decimal(result["Avg. Free and Clear Return"]),
        levered_irr = to_decimal(result["Levered IRR"]),
        levered_equity_multiple = to_decimal(result["Levered Equity Multiple"]),
        avg_cash_on_cash_return = to_decimal(result["Avg. Cash-on-Cash Return"]),
        min_dscr_noi = to_decimal(result["Min. DSCR (NOI)"]),
        min_debt_yield_noi = to_decimal(result["Min. Debt Yield (NOI)"])
      )
      db.session.add(new_metrics)
      current_app.logger.info(f"Created new property metrics for Property ID: {property_id}")
      
    db.session.commit()
    current_app.logger.info(f"Property metrics data saved/updated for Property ID: {property_id}")
    
    return result


def property_metrics_fast(property_id, input_data, output3_data):
    
    financial_chars = input_data.get('financial_chars')
    prop_data = input_data.get('property')
    acq_costs = input_data.get('acq_costs')

    
    net_unlevered_cash_flow = output3_data["Unlevered Net Unlevered Cash Flow"]
    net_unlevered_cash_flow_arr = [
      float(net_unlevered_cash_flow[1].get("Value")),
      float(net_unlevered_cash_flow[2].get("Value")),
      float(net_unlevered_cash_flow[3].get("Value")),
      float(net_unlevered_cash_flow[4].get("Value")),
      float(net_unlevered_cash_flow[5].get("Value")),
      float(net_unlevered_cash_flow[6].get("Value")),
      float(net_unlevered_cash_flow[7].get("Value")),
      float(net_unlevered_cash_flow[8].get("Value")),
      float(net_unlevered_cash_flow[9].get("Value")),
      float(net_unlevered_cash_flow[10].get("Value")),
    ]
    
    def calculate_npv(rate, cash_flows):
      """
      Manually calculates the Net Present Value (NPV).
      
      Args:
          rate (float): The discount rate per period.
          initial_investment (float): The cash flow at time t=0 (e.g., a negative value for an outflow).
          cash_flows (list): A list of cash flows for periods 1 to n.
          
      Returns:
          float: The calculated Net Present Value.
      """
      npv = 0
      
      # Calculate the present value of each future cash flow
      for t, cf in enumerate(cash_flows, 1):
          npv += cf / (1 + rate)**t
                
      return npv
    
   
    
    avg_free_and_clear_return = output3_data["Avg. Free and Clear Return (%)"]
    avg_free_and_clear_return_arr = [
      float(avg_free_and_clear_return[0].get("Value")),
      float(avg_free_and_clear_return[1].get("Value")),
      float(avg_free_and_clear_return[2].get("Value")),
      float(avg_free_and_clear_return[3].get("Value")),
      float(avg_free_and_clear_return[4].get("Value")),
      float(avg_free_and_clear_return[5].get("Value")),
      float(avg_free_and_clear_return[6].get("Value")),
      float(avg_free_and_clear_return[7].get("Value")),
      float(avg_free_and_clear_return[8].get("Value")),
      float(avg_free_and_clear_return[9].get("Value")),
    ]
       
    analysis_period = float(financial_chars.analysis_period)
    
    avg_cash_on_cash_return = output3_data["Avg. Cash-on-Cash Return (%)"]
    avg_cash_on_cash_return_arr = [
      float(avg_cash_on_cash_return[0].get("Value")),
      float(avg_cash_on_cash_return[1].get("Value")),
      float(avg_cash_on_cash_return[2].get("Value")),
      float(avg_cash_on_cash_return[3].get("Value")),
      float(avg_cash_on_cash_return[4].get("Value")),
      float(avg_cash_on_cash_return[5].get("Value")),
      float(avg_cash_on_cash_return[6].get("Value")),
      float(avg_cash_on_cash_return[7].get("Value")),
      float(avg_cash_on_cash_return[8].get("Value")),
      float(avg_cash_on_cash_return[9].get("Value")),
    ]
    
    debt_coverage_ratio = output3_data["Debt Coverage Ratio (NOI)"]
    debt_coverage_ratio_arr = [
      float(debt_coverage_ratio[0].get("Value")),
      float(debt_coverage_ratio[1].get("Value")),
      float(debt_coverage_ratio[2].get("Value")),
      float(debt_coverage_ratio[3].get("Value")),
      float(debt_coverage_ratio[4].get("Value")),
      float(debt_coverage_ratio[5].get("Value")),
      float(debt_coverage_ratio[6].get("Value")),
      float(debt_coverage_ratio[7].get("Value")),
      float(debt_coverage_ratio[8].get("Value")),
      float(debt_coverage_ratio[9].get("Value")),
    ]
      
    debt_yield_noi = output3_data["Debt Yield (NOI) (%)"]
    debt_yield_noi_arr = [
      float(debt_yield_noi[0].get("Value")),
      float(debt_yield_noi[1].get("Value")),
      float(debt_yield_noi[2].get("Value")),
      float(debt_yield_noi[3].get("Value")),
      float(debt_yield_noi[4].get("Value")),
      float(debt_yield_noi[5].get("Value")),
      float(debt_yield_noi[6].get("Value")),
      float(debt_yield_noi[7].get("Value")),
      float(debt_yield_noi[8].get("Value")),
      float(debt_yield_noi[9].get("Value")),
    ]
  
  
    purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0
    dcf_value = calculate_npv(float(financial_chars.discount_rate) / 100, net_unlevered_cash_flow_arr) 
    replacement_cost = float(prop_data.psf) * float(prop_data.square_footage)
    unlevered_irr = float(output3_data["Unlevered IRR (%)"]) * 100
    unlevered_equity_multiple = float(output3_data["Unlevered Equity Multiple"])
    avg_free_and_clear_return = avg_free_and_clear_return_arr[int(analysis_period) - 1] * 100
    levered_irr = float(output3_data["Levered IRR (%)"]) * 100
    levered_equity_multiple = float(output3_data["Levered Equity Multiple"])
    avg_cash_on_cash_return = avg_cash_on_cash_return_arr[int(analysis_period) - 1] * 100
    min_dscr_noi = min(debt_coverage_ratio_arr)
    min_debt_yield_noi = min(debt_yield_noi_arr) * 100

    result = {
        "Purchase Price": purchase_price, # 
        "DCF Value": dcf_value,
        "Replacement Cost": replacement_cost,
        "Unlevered IRR": unlevered_irr,
        "Levered IRR": levered_irr,
        "Unlevered Equity Multiple": unlevered_equity_multiple,
        "Levered Equity Multiple": levered_equity_multiple,
        "Avg. Free and Clear Return": avg_free_and_clear_return,
        "Avg. Cash-on-Cash Return": avg_cash_on_cash_return,
        "Min. DSCR (NOI)": min_dscr_noi,
        "Min. Debt Yield (NOI)": min_debt_yield_noi
    }
    
    from decimal import Decimal, InvalidOperation

    # Safely convert to Decimal, handling None results from calculations
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value)) # Convert float to string first to avoid precision issues
        except InvalidOperation:
            return default
          
    property_metrics_entry = PropertyMetrics.query.filter_by(property_id=property_id).first()
    
    if property_metrics_entry:
      property_metrics_entry.purchase_price = to_decimal(result["Purchase Price"])
      property_metrics_entry.dcf_value = to_decimal(result["DCF Value"])
      property_metrics_entry.replacement_cost = to_decimal(result["Replacement Cost"])
      property_metrics_entry.unlevered_irr = to_decimal(result["Unlevered IRR"])
      property_metrics_entry.unlevered_equity_multiple = to_decimal(result["Unlevered Equity Multiple"])
      property_metrics_entry.avg_free_clear_return = to_decimal(result["Avg. Free and Clear Return"])
      property_metrics_entry.levered_irr = to_decimal(result["Levered IRR"])
      property_metrics_entry.levered_equity_multiple = to_decimal(result["Levered Equity Multiple"])
      property_metrics_entry.avg_cash_on_cash_return = to_decimal(result["Avg. Cash-on-Cash Return"])
      property_metrics_entry.min_dscr_noi = to_decimal(result["Min. DSCR (NOI)"])
      property_metrics_entry.min_debt_yield_noi = to_decimal(result["Min. Debt Yield (NOI)"])
    else:
      new_metrics = PropertyMetrics(
        property_id = property_id,
        purchase_price = to_decimal(result["Purchase Price"]),
        dcf_value = to_decimal(result["DCF Value"]),
        replacement_cost = to_decimal(result["Replacement Cost"]),
        unlevered_irr = to_decimal(result["Unlevered IRR"]),
        unlevered_equity_multiple = to_decimal(result["Unlevered Equity Multiple"]),
        avg_free_clear_return = to_decimal(result["Avg. Free and Clear Return"]),
        levered_irr = to_decimal(result["Levered IRR"]),
        levered_equity_multiple = to_decimal(result["Levered Equity Multiple"]),
        avg_cash_on_cash_return = to_decimal(result["Avg. Cash-on-Cash Return"]),
        min_dscr_noi = to_decimal(result["Min. DSCR (NOI)"]),
        min_debt_yield_noi = to_decimal(result["Min. Debt Yield (NOI)"])
      )
      db.session.add(new_metrics)
      current_app.logger.info(f"Created new property metrics for Property ID: {property_id}")
      
    db.session.commit()
    current_app.logger.info(f"Property metrics data saved/updated for Property ID: {property_id}")
    
    return result
