from flask import Blueprint, request, jsonify, current_app
from flasgger import swag_from
from flask_cors import cross_origin

from models import (
    db, Units, RentRollUnits, RentRollTotals     
)

output5_bp = Blueprint('output5', __name__)

@output5_bp.route('/output5/<string:property_id>', methods=['POST'])
@cross_origin()
@swag_from({
    'tags': ['Output 5'],
    'description': 'This endpoint calculates a rent roll summary based on a provided list of units. It expects unit data in the request body.',
    'parameters': [
        {
            'name': 'property_id',
            'in': 'path',
            'type': 'string',
            'required': True,
            'description': 'The UUID of the property to summarize.'
        }
    ],
    'responses': {
        '200': {
            'description': 'Rent roll summary data with unit-level details and totals.',
            'schema': {
                'type': 'object',
                'properties': {
                    'rent_roll': {
                        'type': 'array',
                        'description': 'A list of unit-level rent summaries.',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'Unit': {
                                    'type': 'string',
                                    'description': 'The unit identifier.',
                                    'example': 'Apt 101'
                                },
                                'Year 0': {
                                    'type': 'number',
                                    'description': 'The annualized rent for the base year.',
                                    'example': 12000.00
                                },
                                'T12': {
                                    'type': 'number',
                                    'description': 'The annualized rent for the trailing 12 months.',
                                    'example': 12500.00
                                },
                                'Pro Forma Year 1': {
                                    'type': 'number',
                                    'description': 'The annualized pro forma rent for Year 1.',
                                    'example': 13000.00
                                }
                            }
                        }
                    },
                    'totals': {
                        'type': 'object',
                        'description': 'Total annualized rents across all units.',
                        'properties': {
                            'Year 0': {
                                'type': 'number',
                                'description': 'The total annualized rent for the base year.',
                                'example': 26500.00
                            },
                            'T12': {
                                'type': 'number',
                                'description': 'The total annualized rent for the trailing 12 months.',
                                'example': 27100.00
                            },
                            'Pro Forma Year 1': {
                                'type': 'number',
                                'description': 'The total annualized pro forma rent for Year 1.',
                                'example': 27500.00
                            }
                        }
                    }
                }
            }
        },
        '400': {
            'description': 'Bad request, such as a missing or malformed request body.',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string'
                    }
                }
            }
        },
        '401': {
            'description': 'Invalid or expired authentication token.',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string'
                    }
                }
            }
        },
        '404': {
            'description': 'Property not found or access denied.',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string'
                    }
                }
            }
        },
        '500': {
            'description': 'Internal server error during data retrieval or calculation.',
            'schema': {
                'type': 'object',
                'properties': {
                    'error': {
                        'type': 'string'
                    }
                }
            }
        }
    }
})
def calculate_output5_endpoint(property_id):
    print(f"Received request for Output 5 - Rent Roll. Property ID received: {property_id}")
    rentroll = calculate_rent_roll(property_id)
    return rentroll

def calculate_rent_roll(property_id):
    try:
        # data = request.get_json()
        # if not data:
        #     return jsonify({"error": "Request body is required"}), 400
        
        units_data = Units.query.filter_by(property_id=property_id).all()
        if not units_data:
            current_app.logger.warning(f"Output 5 - Property ID {property_id} not found.")
            return jsonify({"error": f"Output 5 - Property with ID: {property_id} not found or access denied."}), 404
        else:
          current_app.logger.info(f"Successfully retrieved property database {property_id}. Units_data: {units_data}")
        
        # units_data = data.get('units', []) # PENDING: the entire unit information? which fields?
        # if not units_data:
            # return jsonify({"error": "Units data is required"}), 400
        
        # Check if inactive units should be included
        # projection_settings = data.get('projection_settings', {}) # PENDING: the entire tenant profile section?
        include_inactive = True # projection_settings.get('include_inactive_units', False) 
        
        # Validate required fields
        # for unit in units_data:
        #     required_fields = ['unit_number', 'year_0_annualized', 't12_annualized', 'pro_forma_annualized']
        #     for field in required_fields:
        #         if field not in unit:
        #             return jsonify({"error": f"Missing required field '{field}' for unit {unit.get('unit_number', 'unknown')}"}), 400
        
        # Process units and calculate totals
        units_output = []
        total_year_0 = 0
        total_t12 = 0
        total_pro_forma = 0
        
        for unit in units_data:
            unit_number = float(unit.unit_number)# unit['unit_number']
            year_0_annualized = float(unit.y0_annualized_gross) if unit.y0_annualized_gross is not None else 0.0 # float(unit['year_0_annualized'])
            t12_annualized = float(unit.t12_annualized_gross) if unit.t12_annualized_gross is not None else 0.0 # float(unit['t12_annualized'])
            pro_forma_annualized = float(unit.pro_forma_annualized_gross) if unit.pro_forma_annualized_gross is not None else 0.0 # float(unit['pro_forma_annualized'])
            is_active = False if unit.status == "Occupied" else True   # unit.get('is_active', True)
            
            # Apply active/inactive logic
            final_year_0 = year_0_annualized if (is_active or include_inactive) else 0
            final_t12 = t12_annualized if (is_active or include_inactive) else 0
            final_pro_forma = pro_forma_annualized if (is_active or include_inactive) else 0
            
            total_year_0 += final_year_0
            total_t12 += final_t12
            total_pro_forma += final_pro_forma
            
            units_output.append({
                "Unit": unit_number,
                "Year 0": round(final_year_0, 2),
                "T12": round(final_t12, 2),
                "Pro Forma Year 1": round(final_pro_forma, 2)
            })
        
        summary = {
            "rent_roll": units_output,
            "totals": {
                "Year 0": round(total_year_0, 2),
                "T12": round(total_t12, 2),
                "Pro Forma Year 1": round(total_pro_forma, 2)
            }
        }
        
        from decimal import Decimal, InvalidOperation

        def to_decimal(value, default=None):
            if value is None:
                return default
            try:
                return Decimal(str(value))
            except InvalidOperation:
                return default
        
        for unit_data in units_output:
            unit_number = str(unit_data['Unit'])
            
            unit_entry = RentRollUnits.query.filter_by(
                property_id=property_id,
                unit_num=unit_number
            ).first()

            if unit_entry:
                current_app.logger.info(f"Updating rent roll unit {unit_number} for property {property_id}")
            else:
                unit_entry = RentRollUnits(
                    property_id=property_id,
                    unit_num=unit_number
                )
                db.session.add(unit_entry)
                current_app.logger.info(f"Creating new rent roll unit {unit_number} for property {property_id}")

            unit_entry.year_0 = to_decimal(unit_data.get('Year 0'))
            unit_entry.t12 = to_decimal(unit_data.get('T12'))
            unit_entry.pro_forma = to_decimal(unit_data.get('Pro Forma Year 1'))

        total_data = summary['totals']

        totals_entry = RentRollTotals.query.filter_by(
            property_id=property_id,
        ).first()

        if totals_entry:
            current_app.logger.info(f"Updating rent roll totals for property {property_id}")
        else:
            # Corrected: Removed the category field since it is no longer in the model
            totals_entry = RentRollTotals(
                property_id=property_id
            )
            db.session.add(totals_entry)
            current_app.logger.info(f"Creating new rent roll totals for property {property_id}")

        totals_entry.total_year_0 = to_decimal(total_data.get('Year 0'))
        totals_entry.total_t12 = to_decimal(total_data.get('T12'))
        totals_entry.total_pro_forma = to_decimal(total_data.get('Pro Forma Year 1'))

        db.session.commit()
        current_app.logger.info(f"All rent roll data saved/updated for Property ID: {property_id}")
        
        return summary

    except ValueError as e:
        return jsonify({"error": f"Invalid numeric value: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error retrieving or processing data for property {property_id}: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve or process necessary data for calculation.", "details": str(e)}), 500

def calculate_rent_roll_fast(property_id, input_data):
    units_data = input_data.get('units', [])
    # units_data = data.get('units', []) # PENDING: the entire unit information? which fields?
    # if not units_data:
        # return jsonify({"error": "Units data is required"}), 400
    
    # Check if inactive units should be included
    # projection_settings = data.get('projection_settings', {}) # PENDING: the entire tenant profile section?
    include_inactive = True # projection_settings.get('include_inactive_units', False) 
    
    # Validate required fields
    # for unit in units_data:
    #     required_fields = ['unit_number', 'year_0_annualized', 't12_annualized', 'pro_forma_annualized']
    #     for field in required_fields:
    #         if field not in unit:
    #             return jsonify({"error": f"Missing required field '{field}' for unit {unit.get('unit_number', 'unknown')}"}), 400
    
    # Process units and calculate totals
    units_output = []
    total_year_0 = 0
    total_t12 = 0
    total_pro_forma = 0
    
    for unit in units_data:
        unit_number = float(unit.unit_number)# unit['unit_number']
        year_0_annualized = float(unit.y0_annualized_gross) if unit.y0_annualized_gross is not None else 0.0 # float(unit['year_0_annualized'])
        t12_annualized = float(unit.t12_annualized_gross) if unit.t12_annualized_gross is not None else 0.0 # float(unit['t12_annualized'])
        pro_forma_annualized = float(unit.pro_forma_annualized_gross) if unit.pro_forma_annualized_gross is not None else 0.0 # float(unit['pro_forma_annualized'])
        is_active = False if unit.status == "Occupied" else True   # unit.get('is_active', True)
        
        # Apply active/inactive logic
        final_year_0 = year_0_annualized if (is_active or include_inactive) else 0
        final_t12 = t12_annualized if (is_active or include_inactive) else 0
        final_pro_forma = pro_forma_annualized if (is_active or include_inactive) else 0
        
        total_year_0 += final_year_0
        total_t12 += final_t12
        total_pro_forma += final_pro_forma
        
        units_output.append({
            "Unit": unit_number,
            "Year 0": round(final_year_0, 2),
            "T12": round(final_t12, 2),
            "Pro Forma Year 1": round(final_pro_forma, 2)
        })
    
    summary = {
        "rent_roll": units_output,
        "totals": {
            "Year 0": round(total_year_0, 2),
            "T12": round(total_t12, 2),
            "Pro Forma Year 1": round(total_pro_forma, 2)
        }
    }
    
    from decimal import Decimal, InvalidOperation

    def to_decimal(value, default=None):
        if value is None:
            return default
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return default
    
    for unit_data in units_output:
        unit_number = str(unit_data['Unit'])
        
        unit_entry = RentRollUnits.query.filter_by(
            property_id=property_id,
            unit_num=unit_number
        ).first()

        if unit_entry:
            current_app.logger.info(f"Updating rent roll unit {unit_number} for property {property_id}")
        else:
            unit_entry = RentRollUnits(
                property_id=property_id,
                unit_num=unit_number
            )
            db.session.add(unit_entry)
            current_app.logger.info(f"Creating new rent roll unit {unit_number} for property {property_id}")

        unit_entry.year_0 = to_decimal(unit_data.get('Year 0'))
        unit_entry.t12 = to_decimal(unit_data.get('T12'))
        unit_entry.pro_forma = to_decimal(unit_data.get('Pro Forma Year 1'))

    total_data = summary['totals']

    totals_entry = RentRollTotals.query.filter_by(
        property_id=property_id,
    ).first()

    if totals_entry:
        current_app.logger.info(f"Updating rent roll totals for property {property_id}")
    else:
        # Corrected: Removed the category field since it is no longer in the model
        totals_entry = RentRollTotals(
            property_id=property_id
        )
        db.session.add(totals_entry)
        current_app.logger.info(f"Creating new rent roll totals for property {property_id}")

    totals_entry.total_year_0 = to_decimal(total_data.get('Year 0'))
    totals_entry.total_t12 = to_decimal(total_data.get('T12'))
    totals_entry.total_pro_forma = to_decimal(total_data.get('Pro Forma Year 1'))

    db.session.commit()
    current_app.logger.info(f"All rent roll data saved/updated for Property ID: {property_id}")
    
    return summary
