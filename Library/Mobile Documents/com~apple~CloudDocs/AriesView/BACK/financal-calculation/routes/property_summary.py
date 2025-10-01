from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin

# Import only the specific Firebase module needed for token verification
from firebase_admin import auth # We only need 'auth' here, as 'firebase_admin' is initialized in app.py

# Import your models from the dedicated models.py file
from models import (
    db, FinancialAcquisitionCost, FinancialAssumption, Property,
    PropertyFinancialsAndCharacteristic, User, PropertySummary, FinancingAssumptions, Output3
)

property_summary_bp = Blueprint('property_summary', __name__)

def property_summary(property_id, firebase_uid):
    try:
        # 1. Filter properties by the now-verified firebase_uid to ensure ownership
        prop_data = Property.query.filter_by(id=property_id, firebase_uid=firebase_uid).first()
        if not prop_data:
            current_app.logger.warning(f"Property ID {property_id} not found or does not belong to user {firebase_uid}.")
            return jsonify({"error": f"Property with ID: {property_id} not found or access denied."}), 404
        else:
          current_app.logger.info(f"Successfully retrieved property database {property_id}. Prop_data: {prop_data}")
          
        assumptions = FinancialAssumption.query.filter_by(property_id=property_id).first()
        if not assumptions:
            current_app.logger.warning(f"No financial assumptions found for property_id: {property_id}")
            return jsonify({"error": f"No financial assumptions found for Property ID: {property_id}"}), 404
        else:
          current_app.logger.info(f"Successfully retrieved financial_assumptions database {property_id}. assumptions: {assumptions}")

        financial_chars = PropertyFinancialsAndCharacteristic.query.filter_by(property_id=property_id).first()
        if not financial_chars:
            current_app.logger.warning(f"No property financials/characteristics found for property_id: {property_id}")
            return jsonify({"error": f"No property financials/characteristics found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved financial_characteristics database {property_id}. financial_characteristics: {financial_chars}")


        # 2. Retrieve remaining database info using the verified property_id
        acq_costs = FinancialAcquisitionCost.query.filter_by(property_id=property_id).first()
        if not acq_costs:
            current_app.logger.warning(f"No acquisition costs found for property_id: {property_id}")
            return jsonify({"error": f"No acquisition costs found for Property ID: {property_id}"}), 404
        else:
          current_app.logger.info(f"Successfully retrieved acquisitions database {property_id}. acquisitions: {acq_costs}")

        # output1_fin_assumptions = FinancingAssumptions.query.filter_by(property_id=property_id).first()
        # if not output1_fin_assumptions:
        #     current_app.logger.warning(f"No Financing Assumptions found for property_id: {property_id}")
        #     return jsonify({"error": f"No Financing Assumptions found for Property ID: {property_id}"}), 404
        # else:
        #   current_app.logger.info(f"Successfully retrieved Financing Assumptions database {property_id}. Financing Assumptions: {output1_fin_assumptions}")

        output3 = Output3.query.filter_by(property_id=property_id, category="Loan Amount").first()
        
        
        # --- Extract data into variables for calculation (and convert to float) ---
        purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0
        rentable_area = float(prop_data.square_footage) if prop_data.square_footage is not None else 0
        due_diligence_closing_cost = float(acq_costs.due_diligence_costs) if acq_costs.due_diligence_costs is not None else 0
        upfront_capex = float(acq_costs.upfront_capex)
        lender_fees = float(assumptions.lender_fees)
        loan_amount = float(output3.year_0)
        analysis_period = float(financial_chars.analysis_period)
        exit_cap_rate_growth_per_yr = float(financial_chars.exit_cap_rate_growth)
        year1_market_cap_rate = float(financial_chars.market_cap_rate)
        sales_price = float(acq_costs.selling_cost_at_exit) if acq_costs.selling_cost_at_exit is not None else 0
        
        noi = Output3.query.filter_by(property_id=property_id, category="Net Operating Income").first()
        if not noi:
            current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Net Operating Income.")
            year1_noi = 5000
            year3_noi = 3000
        else:
            year1_noi = float(noi.year_1)
            year3_noi = float(noi.year_3)
        
        year1_market_cap_rate = float(financial_chars.market_cap_rate)
        
        gross_sales_price_arr = []
        gross_sales_price = Output3.query.filter_by(property_id=property_id, category="Gross Sales Price").first()
        if not gross_sales_price:
          current_app.logger.warning(f"Missing Output3 data for property {property_id} and category Net Operating Income")
        else:
          gross_sales_price_arr.append(float(gross_sales_price.year_1))
          gross_sales_price_arr.append(float(gross_sales_price.year_2))
          gross_sales_price_arr.append(float(gross_sales_price.year_3))
          gross_sales_price_arr.append(float(gross_sales_price.year_4))
          gross_sales_price_arr.append(float(gross_sales_price.year_5))
          gross_sales_price_arr.append(float(gross_sales_price.year_6))
          gross_sales_price_arr.append(float(gross_sales_price.year_7))
          gross_sales_price_arr.append(float(gross_sales_price.year_8))
          gross_sales_price_arr.append(float(gross_sales_price.year_9))
          gross_sales_price_arr.append(float(gross_sales_price.year_10))
          
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process necessary data for calculation.", "details": str(e)}), 500


    # --- Financial Calculations ---
    all_in_basis = (1 + due_diligence_closing_cost / 100) * purchase_price + loan_amount * (lender_fees / 100) + upfront_capex
    going_in_cap_rate = year1_noi / purchase_price if purchase_price else None
    print(going_in_cap_rate, year1_noi, purchase_price)
    price_per_sf = purchase_price / rentable_area if rentable_area else None
    terminal_cap_rate = year1_market_cap_rate / 100 + (analysis_period * (exit_cap_rate_growth_per_yr / 10000))# float(financial_chars.exit_cap_rate_growth) if financial_chars.exit_cap_rate_growth is not None else None
    terminal_value = gross_sales_price_arr[int(analysis_period) - 1]

    result = {
        "All-in Basis": round(all_in_basis) if all_in_basis is not None else None,
        "Going-in Cap Rate (%)": round(going_in_cap_rate * 100, 2) if going_in_cap_rate is not None else None,
        "Price/SF": round(price_per_sf, 2) if price_per_sf is not None else None,
        "Year 1 NOI": year1_noi, # replace with actual value 
        "Year 3 NOI": year3_noi, # replace with actual value
        "Terminal Cap Rate (%)": round(terminal_cap_rate * 100, 2) if terminal_cap_rate is not None else None,
        "Terminal Value": round(terminal_value, 2) if terminal_value is not None else None
    }
    current_app.logger.info(f"Calculation complete for property ID {property_id}. Result: {result}")

    from decimal import Decimal, InvalidOperation

    # Safely convert to Decimal, handling None results from calculations
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value)) # Convert float to string first to avoid precision issues
        except InvalidOperation:
            return default
    # Query for an existing summary for this property_id
    property_summary_entry = PropertySummary.query.filter_by(property_id=property_id).first()

    if property_summary_entry:
        # Update existing entry
        property_summary_entry.all_in_basis = to_decimal(result["All-in Basis"])
        property_summary_entry.going_in_cap_rate = to_decimal(result["Going-in Cap Rate (%)"])
        property_summary_entry.price_per_sf = to_decimal(result["Price/SF"])
        property_summary_entry.year_1_noi = to_decimal(result["Year 1 NOI"])
        property_summary_entry.year_3_noi = to_decimal(result["Year 3 NOI"])
        property_summary_entry.terminal_cap_rate = to_decimal(result["Terminal Cap Rate (%)"])
        property_summary_entry.terminal_value = to_decimal(result["Terminal Value"])
        # updated_at will be automatically handled by onupdate in the model
        current_app.logger.info(f"Updated property summary for Property ID: {property_id}")
    else:
        # Create a new entry
        new_summary = PropertySummary(
            property_id=property_id,
            all_in_basis=to_decimal(result["All-in Basis"]),
            going_in_cap_rate=to_decimal(result["Going-in Cap Rate (%)"]),
            price_per_sf=to_decimal(result["Price/SF"]),
            year_1_noi=to_decimal(result["Year 1 NOI"]),
            year_3_noi=to_decimal(result["Year 3 NOI"]),
            terminal_cap_rate=to_decimal(result["Terminal Cap Rate (%)"]),
            terminal_value=to_decimal(result["Terminal Value"])
        )
        db.session.add(new_summary)
        current_app.logger.info(f"Created new property summary for Property ID: {property_id}")

    db.session.commit()
    current_app.logger.info(f"Property summary data saved/updated for Property ID: {property_id}")

    return result # Return the calculated result to the frontend
  

def property_summary_fast(property_id, input_data, output3_data):
    
    financial_chars = input_data.get('financial_chars')
    prop_data = input_data.get('property')
    acq_costs = input_data.get('acq_costs')
    assumptions = input_data.get('financial_assumptions')
    
    
    # --- Extract data into variables for calculation (and convert to float) ---
    loan_amount_arr = output3_data["Loan Amount"]
    # print(loan_amount_arr[0].get("Value"))
    loan_amount = float(loan_amount_arr[0].get("Value"))
    purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0
    rentable_area = float(prop_data.square_footage) if prop_data.square_footage is not None else 0
    due_diligence_closing_cost = float(acq_costs.due_diligence_costs) if acq_costs.due_diligence_costs is not None else 0
    upfront_capex = float(acq_costs.upfront_capex)
    lender_fees = float(assumptions.lender_fees)
    analysis_period = float(financial_chars.analysis_period)
    exit_cap_rate_growth_per_yr = float(financial_chars.exit_cap_rate_growth)
    year1_market_cap_rate = float(financial_chars.market_cap_rate)
    sales_price = float(acq_costs.selling_cost_at_exit) if acq_costs.selling_cost_at_exit is not None else 0
    
    noi = output3_data["Net Operating Income"]
    year1_noi = float(noi[0].get("Value"))
    year3_noi = float(noi[2].get("Value"))
    
    year1_market_cap_rate = float(financial_chars.market_cap_rate)
    
    gross_sales_price = output3_data["Gross Sales Price"]
    gross_sales_price_arr = [
      float(gross_sales_price[0].get("Value")),
      float(gross_sales_price[1].get("Value")),
      float(gross_sales_price[2].get("Value")),
      float(gross_sales_price[3].get("Value")),
      float(gross_sales_price[4].get("Value")),
      float(gross_sales_price[5].get("Value")),
      float(gross_sales_price[6].get("Value")),
      float(gross_sales_price[7].get("Value")),
      float(gross_sales_price[8].get("Value")),
      float(gross_sales_price[9].get("Value")),
    ]
    
    # --- Financial Calculations ---
    all_in_basis = (1 + due_diligence_closing_cost / 100) * purchase_price + loan_amount * (lender_fees / 100) + upfront_capex
    going_in_cap_rate = year1_noi / purchase_price if purchase_price else None
    # print(going_in_cap_rate, year1_noi, purchase_price)
    price_per_sf = purchase_price / rentable_area if rentable_area else None
    terminal_cap_rate = year1_market_cap_rate / 100 + (analysis_period * (exit_cap_rate_growth_per_yr / 10000))# float(financial_chars.exit_cap_rate_growth) if financial_chars.exit_cap_rate_growth is not None else None
    terminal_value = gross_sales_price_arr[int(analysis_period) - 1]

    result = {
        "All-in Basis": round(all_in_basis) if all_in_basis is not None else None,
        "Going-in Cap Rate (%)": round(going_in_cap_rate * 100, 2) if going_in_cap_rate is not None else None,
        "Price/SF": round(price_per_sf, 2) if price_per_sf is not None else None,
        "Year 1 NOI": year1_noi, # replace with actual value 
        "Year 3 NOI": year3_noi, # replace with actual value
        "Terminal Cap Rate (%)": round(terminal_cap_rate * 100, 2) if terminal_cap_rate is not None else None,
        "Terminal Value": round(terminal_value, 2) if terminal_value is not None else None
    }
    current_app.logger.info(f"Calculation complete for property ID {property_id}. Result: {result}")

    from decimal import Decimal, InvalidOperation

    # Safely convert to Decimal, handling None results from calculations
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value)) # Convert float to string first to avoid precision issues
        except InvalidOperation:
            return default
    # Query for an existing summary for this property_id
    property_summary_entry = PropertySummary.query.filter_by(property_id=property_id).first()

    if property_summary_entry:
        # Update existing entry
        property_summary_entry.all_in_basis = to_decimal(result["All-in Basis"])
        property_summary_entry.going_in_cap_rate = to_decimal(result["Going-in Cap Rate (%)"])
        property_summary_entry.price_per_sf = to_decimal(result["Price/SF"])
        property_summary_entry.year_1_noi = to_decimal(result["Year 1 NOI"])
        property_summary_entry.year_3_noi = to_decimal(result["Year 3 NOI"])
        property_summary_entry.terminal_cap_rate = to_decimal(result["Terminal Cap Rate (%)"])
        property_summary_entry.terminal_value = to_decimal(result["Terminal Value"])
        # updated_at will be automatically handled by onupdate in the model
        current_app.logger.info(f"Updated property summary for Property ID: {property_id}")
    else:
        # Create a new entry
        new_summary = PropertySummary(
            property_id=property_id,
            all_in_basis=to_decimal(result["All-in Basis"]),
            going_in_cap_rate=to_decimal(result["Going-in Cap Rate (%)"]),
            price_per_sf=to_decimal(result["Price/SF"]),
            year_1_noi=to_decimal(result["Year 1 NOI"]),
            year_3_noi=to_decimal(result["Year 3 NOI"]),
            terminal_cap_rate=to_decimal(result["Terminal Cap Rate (%)"]),
            terminal_value=to_decimal(result["Terminal Value"])
        )
        db.session.add(new_summary)
        current_app.logger.info(f"Created new property summary for Property ID: {property_id}")

    db.session.commit()
    current_app.logger.info(f"Property summary data saved/updated for Property ID: {property_id}")

    return result # Return the calculated result to the frontend


@property_summary_bp.route('/property-summary/<string:property_id>', methods=['POST'])
@cross_origin()
def property_summary_endpoint(property_id):
  """
    Property Summary Calculation
    ---
    tags:
      - Output 1 - Property Summary
    description: This endpoint calculates property summary details based on stored financial data for a given property_id. It expects a Firebase authentication token in the request body, which will be verified to extract the user's ID and ensure property ownership.
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
      400:
        description: Bad request (e.g., idToken missing from body).
      401:
        description: Invalid or expired authentication token.
      404:
        description: Property not found or access denied (property does not belong to user).
      500:
        description: Internal server error during data retrieval or calculation.
    """
    
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


  summary = property_summary(property_id, firebase_uid);
  return summary;