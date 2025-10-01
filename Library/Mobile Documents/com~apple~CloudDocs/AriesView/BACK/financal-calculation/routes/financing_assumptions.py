from flask import Blueprint, request, jsonify, current_app
from numpy_financial import pmt
from models import db
from firebase_admin import auth
from flask_cors import cross_origin

from models import (
    FinancialAcquisitionCost, FinancialAssumption, Property,
    PropertyFinancialsAndCharacteristic, User, PropertySummary,
    FinancingAssumptions
)

financing_bp = Blueprint('financing_assumptions', __name__)


# MOCK_ASSUMPTIONS_INPUTS = {
#   "loan_amount": 18000000,
#   "lender_fees": 50000,
#   "equity_required": 6500000,
#   "annual_io_payment": 900000, # Example: Annual Interest-Only Payment
#   "annual_amo_payment": 1200000 # Example: Annual Amortizing Payment (P&I)
# }
def financing_assumptions(property_id, firebase_uid):
    
    try:
        # Input Tables
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
        
        acq_costs = FinancialAcquisitionCost.query.filter_by(property_id=property_id).first()
        if not acq_costs:
            current_app.logger.warning(f"No acquisition costs found for property_id: {property_id}")
            return jsonify({"error": f"No acquisition costs found for Property ID: {property_id}"}), 404
        else:
          current_app.logger.info(f"Successfully retrieved acquisitions database {property_id}. acquisitions: {acq_costs}")

        # Output Tables (if the table is not from the same page, re-calculate)
        property_summary = PropertySummary.query.filter_by(property_id=property_id).first()
        if not property_summary:
            current_app.logger.warning(f"No property summary found for property_id: {property_id}")
            return jsonify({"error": f"No property summary found for Property ID: {property_id}"}), 404
        else:
            current_app.logger.info(f"Successfully retrieved property summary database {property_id}. property summary: {property_summary}")


        purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0 # purchase_price, financial acquisitions cost
        ltv = float(assumptions.loan_to_value) if assumptions.loan_to_value is not None else 0 # loan_to_value, financial assumptions
        basis = float(property_summary.all_in_basis) if property_summary.all_in_basis is not None else 0 # all_in_basis, all_in_basis
        lender_fee_rate = float(assumptions.lender_fees) if assumptions.lender_fees is not None else 0 # lender_fees, financial_assumptions
        interest_rate = float(assumptions.interest_rate_fin_assumptions) if assumptions.interest_rate_fin_assumptions is not None else 0 # interest_rate_fin_assumptions, financial_assumptions
        amortization_years = float(assumptions.amortization_period) if assumptions.amortization_period is not None else 0 # amortization_period, financial_assumptions
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process necessary data for calculation.", "details": str(e)}), 500
    

    print(f"Received financing request for Property ID: {property_id}")


    # Convert LTV from percentage to decimal
    if ltv and ltv > 1:
        ltv = ltv / 100
    
    # if loan_amount is None:
    loan_amount = purchase_price * ltv

    lender_fees = loan_amount * (lender_fee_rate / 100)
    equity_required = basis - loan_amount

    annual_amortizing_payment = pmt(interest_rate / 100 / 12, amortization_years * 12, -loan_amount) * 12
    annual_io_payment = loan_amount * (interest_rate / 100)

    result = {
        "Loan Amount": round(loan_amount),
        "Lender Fees": round(lender_fees),
        "Equity Required": round(equity_required),
        "Annual Amortizing Payment": round(annual_amortizing_payment),
        "Annual Interest-Only Payment": round(annual_io_payment)
    }
    
    from decimal import Decimal, InvalidOperation

    # 2. Define a helper function to safely convert values to Decimal
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return default
    
    financing_assumptions_entry = FinancingAssumptions.query.filter_by(property_id=property_id).first()

    # 4. Check if an entry exists
    if financing_assumptions_entry:
        # Update the existing entry with the new values
        financing_assumptions_entry.loan_amount = to_decimal(result["Loan Amount"])
        financing_assumptions_entry.lender_fees = to_decimal(result["Lender Fees"])
        financing_assumptions_entry.equity_required = to_decimal(result["Equity Required"])
        financing_assumptions_entry.annual_amortizing_payment = to_decimal(result["Annual Amortizing Payment"])
        financing_assumptions_entry.annual_io_payment = to_decimal(result["Annual Interest-Only Payment"])
        current_app.logger.info(f"Updated loan summary for Property ID: {property_id}")
    else:
        # Create a new entry
        new_loan_summary = FinancingAssumptions(
            property_id=property_id,
            loan_amount=to_decimal(result["Loan Amount"]),
            lender_fees=to_decimal(result["Lender Fees"]),
            equity_required=to_decimal(result["Equity Required"]),
            annual_amortizing_payment=to_decimal(result["Annual Amortizing Payment"]),
            annual_interest_only_payment=to_decimal(result["Annual Interest-Only Payment"])
        )
        db.session.add(new_loan_summary)
        current_app.logger.info(f"Created new loan summary for Property ID: {property_id}")

    # 5. Commit the changes to the database
    db.session.commit()
    current_app.logger.info(f"Loan summary data saved/updated for Property ID: {property_id}")


    return result
  
def financing_assumptions_fast(property_id, input_data, property_summary_data):
    
    assumptions = input_data.get('financial_assumptions')
    acq_costs = input_data.get('acq_costs')
    

    purchase_price = float(acq_costs.purchase_price) if acq_costs.purchase_price is not None else 0 # purchase_price, financial acquisitions cost
    ltv = float(assumptions.loan_to_value) if assumptions.loan_to_value is not None else 0 # loan_to_value, financial assumptions
    basis = float(property_summary_data["All-in Basis"]) if property_summary_data["All-in Basis"] is not None else 0 # all_in_basis, all_in_basis
    lender_fee_rate = float(assumptions.lender_fees) if assumptions.lender_fees is not None else 0 # lender_fees, financial_assumptions
    interest_rate = float(assumptions.interest_rate_fin_assumptions) if assumptions.interest_rate_fin_assumptions is not None else 0 # interest_rate_fin_assumptions, financial_assumptions
    amortization_years = float(assumptions.amortization_period) if assumptions.amortization_period is not None else 0 # amortization_period, financial_assumptions


    # print(f"Received financing request for Property ID: {property_id}")


    # Convert LTV from percentage to decimal
    if ltv and ltv > 1:
        ltv = ltv / 100
    
    # if loan_amount is None:
    loan_amount = purchase_price * ltv

    lender_fees = loan_amount * (lender_fee_rate / 100)
    equity_required = basis - loan_amount

    annual_amortizing_payment = pmt(interest_rate / 100 / 12, amortization_years * 12, -loan_amount) * 12
    annual_io_payment = loan_amount * (interest_rate / 100)

    result = {
        "Loan Amount": round(loan_amount),
        "Lender Fees": round(lender_fees),
        "Equity Required": round(equity_required),
        "Annual Amortizing Payment": round(annual_amortizing_payment),
        "Annual Interest-Only Payment": round(annual_io_payment)
    }
    
    from decimal import Decimal, InvalidOperation

    # 2. Define a helper function to safely convert values to Decimal
    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return default
    
    financing_assumptions_entry = FinancingAssumptions.query.filter_by(property_id=property_id).first()

    # 4. Check if an entry exists
    if financing_assumptions_entry:
        # Update the existing entry with the new values
        financing_assumptions_entry.loan_amount = to_decimal(result["Loan Amount"])
        financing_assumptions_entry.lender_fees = to_decimal(result["Lender Fees"])
        financing_assumptions_entry.equity_required = to_decimal(result["Equity Required"])
        financing_assumptions_entry.annual_amortizing_payment = to_decimal(result["Annual Amortizing Payment"])
        financing_assumptions_entry.annual_io_payment = to_decimal(result["Annual Interest-Only Payment"])
        current_app.logger.info(f"Updated loan summary for Property ID: {property_id}")
    else:
        # Create a new entry
        new_loan_summary = FinancingAssumptions(
            property_id=property_id,
            loan_amount=to_decimal(result["Loan Amount"]),
            lender_fees=to_decimal(result["Lender Fees"]),
            equity_required=to_decimal(result["Equity Required"]),
            annual_amortizing_payment=to_decimal(result["Annual Amortizing Payment"]),
            annual_interest_only_payment=to_decimal(result["Annual Interest-Only Payment"])
        )
        db.session.add(new_loan_summary)
        current_app.logger.info(f"Created new loan summary for Property ID: {property_id}")

    # 5. Commit the changes to the database
    db.session.commit()
    current_app.logger.info(f"Loan summary data saved/updated for Property ID: {property_id}")


    return result



@financing_bp.route('/financing-assumptions/<string:property_id>', methods=['POST'])
@cross_origin()
def financing_assumptions_endpoint(property_id):
  """
    Financing Assumptions
    ---
    tags:
      - Output 1 - Financing Assumptions
    description: This endpoint calculates financing details for a property, such as loan amount, equity required, and annual payments. It expects a Firebase authentication token and property data to be passed in the request body.
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
        description: A dictionary containing the calculated financing assumptions.
        schema:
          type: object
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
      400:
        description: Bad request (e.g., idToken or other parameters are missing).
      401:
        description: Invalid or expired authentication token.
      404:
        description: Property not found or data missing for the given property_id.
      500:
        description: Internal server error during data retrieval or calculation.
    """
    
    
  request_data = request.get_json()
  current_app.logger.info(f"Received request for property summary. Property ID: {property_id}")

  if not request_data:
    current_app.logger.warning("No JSON data provided in the request body.")
    return jsonify({"error": "Request body must contain JSON data"}), 400
  
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
    
    
  assumptions = financing_assumptions(property_id, firebase_uid);
  return assumptions;