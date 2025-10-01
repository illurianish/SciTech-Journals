# models.py
import uuid # For UUID generation if not using db.UUID(as_uuid=True) directly
# from sqlalchemy_utils import UUIDType # If using UUIDType from sqlalchemy_utils
 # Will need to be handled carefully, see step 2

# --- SQLAlchemy Models - (Moved from property_summary.py) ---
# Ensure these models accurately reflect your actual database schema (column names, types).
from flask_sqlalchemy import SQLAlchemy
# from flask import current_app


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True) # Integer primary key, auto-incrementing
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False, index=True) # Firebase UID, unique and indexed
    email = db.Column(db.String(255), unique=True, nullable=False) # Changed to 255 for standard email length
    display_name = db.Column(db.String(100)) # Display name, optional
    created_at = db.Column(db.DateTime(timezone=True), default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now())


class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.String(36), primary_key=True) # uuid
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50))
    property_type = db.Column(db.String(50))
    # acquisition_date = db.Column(db.Date)
    
    market_value = db.Column(db.Numeric(15, 2))
    square_footage = db.Column(db.Integer) # Maps to rentable_area
    psf = db.Column(db.Integer)
    year_built = db.Column(db.Integer)
    units = db.Column(db.Integer)
    # bedrooms = db.Column(db.Numeric(4,1))
    # bathrooms = db.Column(db.Numeric(4,1))
    # parking_spaces = db.Column(db.Integer)
    # construction_type = db.Column(db.String(100))
    firebase_uid = db.Column(db.String(128), nullable=False, index=True) # NEW: Add this line
    created_at = db.Column(db.DateTime(timezone=True), default=db.func.now()) # Added for consistency
    updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now()) # Added for consistency

    # NEW: Define relationships from Property to other tables
    # uselist=False because each Property will have at most one of each related financial record
    acquisition_costs = db.relationship('FinancialAcquisitionCost', back_populates='property', uselist=False)
    assumptions = db.relationship('FinancialAssumption', back_populates='property', uselist=False)
    financial_characteristics = db.relationship('PropertyFinancialsAndCharacteristic', back_populates='property', uselist=False)
    # The PropertySummary relationship is already defined below using backref, which is fine.
    # property_summary_data = db.relationship('PropertySummary', backref='property', uselist=False) # Alternative to backref in PropertySummary

    def _repr_(self):
        return f"<Property {self.name}>"

class FinancialAcquisitionCost(db.Model):
    __tablename__ = 'financial_acquisition_costs'
    id = db.Column(db.String(36), primary_key=True) # uuid
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id'), unique=True, nullable=False) # uuid
    selling_cost_at_exit = db.Column(db.Numeric(15, 2), nullable=False)
    due_diligence_costs = db.Column(db.Numeric(15, 2), nullable=False)
    upfront_capex = db.Column(db.Numeric(15, 2), nullable=False) # Maps to upfront_capex
    # created_at = db.Column(db.DateTime(timezone=True), default=db.func.now())
    # updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now())
    purchase_price = db.Column(db.Numeric(15, 2)) # Maps to purchase_price
    # NEW: Define back-relationship to Property
    property = db.relationship('Property', back_populates='acquisition_costs')


class FinancialAssumption(db.Model):
    __tablename__ = 'financial_assumptions'
    id = db.Column(db.String(36), primary_key=True) # uuid
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id'), unique=True, nullable=False)
    lender_fees = db.Column(db.Numeric(15, 2), nullable=False)
    loan_to_value = db.Column(db.Numeric(15,2), nullable=False)
    lender_fees = db.Column(db.Numeric(8,4), nullable=False)
    interest_rate_fin_assumptions = db.Column(db.Numeric(8,4), nullable=False)
    amortization_period = db.Column(db.Integer)
    years_interest_only = db.Column(db.Integer)
    # Add other columns from your FinancialAssumption table if they exist
    # created_at = db.Column(db.DateTime(timezone=True), default=db.func.now()) # Added for consistency if you track it
    # updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now()) # Added for consistency

    # NEW: Define back-relationship to Property
    property = db.relationship('Property', back_populates='assumptions')

class OperatingAssumptions(db.Model):
    __tablename__ = 'financial_operating_assumptions'
    id = db.Column(db.String(36), primary_key=True) # uuid
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id'), unique=True, nullable=False)
    vacancy_rate = db.Column(db.Numeric(8, 2), nullable=False)
    management_fee = db.Column(db.Numeric(8,2), nullable=False)


class PropertyFinancialsAndCharacteristic(db.Model):
    __tablename__ = 'property_financials_and_characteristics'
    id = db.Column(db.String(36), primary_key=True) # uuid
    property_id = db.Column(db.String(36), db.ForeignKey('properties.id'), unique=True, nullable=False) # uuid
    analysis_start = db.Column(db.Date)
    analysis_period = db.Column(db.Integer, nullable=False) # Maps to analysis_period
    # exit_valuation_noi = db.Column(db.Numeric, nullable=False) # Maps to exit_year_noi
    # exit_valuation_noi = db.Column(db.Numeric, nullable=False) # Maps to exit_year_noi
    exit_cap_rate_growth = db.Column(db.Numeric, nullable=False) # Maps to exit_cap_rate_growth_per_yr
    market_cap_rate = db.Column(db.Numeric, nullable=False) # Maps to year1_market_cap_rate
    discount_rate = db.Column(db.Numeric)
    # acquisition_cap_rate = db.Column(db.Numeric(8,4))
    # exit_cap_rate = db.Column(db.Numeric(8,4)) # Potential for direct terminal_cap_rate if stored
    # projected_value_growth = db.Column(db.Numeric(8,4))
    # vacancy_rate = db.Column(db.Numeric(8,4))
    # market_rent_growth = db.Column(db.Numeric(8,4))
    # renewal_probability = db.Column(db.Numeric(8,4))
    # inflation_rate = db.Column(db.Numeric(8,4))
    # created_at = db.Column(db.DateTime(timezone=True), default=db.func.now())
    # updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now())
    # acquisition_cap_rate = db.Column(db.Numeric(8,4))
    # exit_cap_rate = db.Column(db.Numeric(8,4)) # Potential for direct terminal_cap_rate if stored
    # projected_value_growth = db.Column(db.Numeric(8,4))
    # vacancy_rate = db.Column(db.Numeric(8,4))
    # market_rent_growth = db.Column(db.Numeric(8,4))
    # renewal_probability = db.Column(db.Numeric(8,4))
    # inflation_rate = db.Column(db.Numeric(8,4))
    # created_at = db.Column(db.DateTime(timezone=True), default=db.func.now())
    # updated_at = db.Column(db.DateTime(timezone=True), default=db.func.now(), onupdate=db.func.now())
    
    # year1_noi_db = db.Column(db.Numeric(15, 2), nullable=False)
    # year3_noi_db = db.Column(db.Numeric(15, 2), nullable=False)

    # NEW: Define back-relationship to Property
    property = db.relationship('Property', back_populates='financial_characteristics')
    
    
class CashFlowInputs(db.Model):
    __tablename__ = 'cash_flow_inputs'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    year_0 = db.Column(db.Numeric(12, 2), nullable=True) # Assuming these can be null if not applicable
    t12 = db.Column(db.Numeric(12, 2), nullable=True)
    pro_forma = db.Column(db.Numeric(12, 2), nullable=True)

    created_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now(), onupdate=db.func.now())

    # A many-to-one relationship with the Property table
    # A property can have many cash flow inputs
    property = db.relationship('Property', backref=db.backref('cash_flow_inputs', lazy=True))

    def __repr__(self):
        return f"<CashFlowInputs(property_id='{self.property_id}', category='{self.category}')>"

class CashFlowProjectionYearly(db.Model):
    __tablename__ = 'cash_flow_projections_yearly'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    year_1 = db.Column(db.Numeric, nullable=True)
    year_2 = db.Column(db.Numeric, nullable=True)
    year_3 = db.Column(db.Numeric, nullable=True)
    year_4 = db.Column(db.Numeric, nullable=True)
    year_5 = db.Column(db.Numeric, nullable=True)
    year_6 = db.Column(db.Numeric, nullable=True)
    year_7 = db.Column(db.Numeric, nullable=True)
    year_8 = db.Column(db.Numeric, nullable=True)
    year_9 = db.Column(db.Numeric, nullable=True)
    year_10 = db.Column(db.Numeric, nullable=True)
    year_11 = db.Column(db.Numeric, nullable=True)
    year_12 = db.Column(db.Numeric, nullable=True)
    year_13 = db.Column(db.Numeric, nullable=True)
    year_14 = db.Column(db.Numeric, nullable=True)
    year_15 = db.Column(db.Numeric, nullable=True)

    created_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now(), onupdate=db.func.now())

    # A many-to-one relationship with the Property table
    # A property can have many yearly cash flow projections
    property = db.relationship('Property', backref=db.backref('cash_flow_projection_yearly', lazy=True))

    def __repr__(self):
        return f"<CashFlowProjectionYearly(property_id='{self.property_id}', category='{self.category}')>"

class TenantProfileYearly(db.Model):
    __tablename__ = 'tenant_profile_yearly'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    year_0 = db.Column(db.Numeric(12, 2), nullable=True) 
    t12 = db.Column(db.Numeric(12, 2), nullable=True)
    pro_forma = db.Column(db.Numeric(12, 2), nullable=True)
    year_1 = db.Column(db.Numeric, nullable=True)
    year_2 = db.Column(db.Numeric, nullable=True)
    year_3 = db.Column(db.Numeric, nullable=True)
    year_4 = db.Column(db.Numeric, nullable=True)
    year_5 = db.Column(db.Numeric, nullable=True)
    year_6 = db.Column(db.Numeric, nullable=True)
    year_7 = db.Column(db.Numeric, nullable=True)
    year_8 = db.Column(db.Numeric, nullable=True)
    year_9 = db.Column(db.Numeric, nullable=True)
    year_10 = db.Column(db.Numeric, nullable=True)
    year_11 = db.Column(db.Numeric, nullable=True)
    year_12 = db.Column(db.Numeric, nullable=True)
    year_13 = db.Column(db.Numeric, nullable=True)
    year_14 = db.Column(db.Numeric, nullable=True)
    year_15 = db.Column(db.Numeric, nullable=True)
    
class Units(db.Model):
    __tablename__ = 'units'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    unit_number = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    y0_annualized_gross = db.Column(db.Numeric(14, 2), nullable=False)
    t12_annualized_gross = db.Column(db.Numeric(14,2), nullable=False)
    pro_forma_annualized_gross = db.Column(db.Numeric(14,2), nullable=False)
    
class PropertySummary(db.Model):
    __tablename__ = 'property_summary' 
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    all_in_basis = db.Column(db.Numeric(14, 2), nullable=False)
    going_in_cap_rate = db.Column(db.Numeric(5, 2), nullable=False)
    price_per_sf = db.Column(db.Numeric(10, 2), nullable=False)
    year_1_noi = db.Column(db.Numeric(14, 2), nullable=False)
    year_3_noi = db.Column(db.Numeric(14, 2), nullable=False)
    terminal_cap_rate = db.Column(db.Numeric(14, 2), nullable=False)
    terminal_value = db.Column(db.Numeric(14, 2), nullable=False) 

    created_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now())
    # onupdate=db.func.now() automatically updates the timestamp on record modification
    updated_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now(), onupdate=db.func.now())

    # The backref here is fine, it sets up the relationship from both sides.
    # It establishes a 'property' attribute on PropertySummary and a 'summary' attribute on Property.
    property = db.relationship('Property', backref=db.backref('summary', uselist=False))

    def _repr_(self):
        return f"<PropertySummary(property_id='{self.property_id}', all_in_basis={self.all_in_basis})>"

class FinancingAssumptions(db.Model):
    __tablename__ = 'financing_assumptions_output1'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    loan_amount = db.Column(db.Numeric(14, 2), nullable=False)
    lender_fees = db.Column(db.Numeric(14, 2), nullable=False)
    equity_required = db.Column(db.Numeric(14, 2), nullable=False)
    annual_amortizing_payment = db.Column(db.Numeric(14, 2), nullable=False)
    annual_interest_only_payment = db.Column(db.Numeric(14, 2), nullable=False)
    created_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now(), onupdate=db.func.now())
    
    property = db.relationship('Property', backref=db.backref('financingassump', uselist=False))


class IncomeStatementSummary(db.Model):
    __tablename__ = 'income_statement_summary'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    base_rent = db.Column(db.Numeric(14, 2), nullable=False)
    recovery_income = db.Column(db.Numeric(14, 2), nullable=False)
    other_income = db.Column(db.Numeric(14, 2), nullable=False)
    potential_gross_income = db.Column(db.Numeric(14, 2), nullable=False)
    rent_abatement = db.Column(db.Numeric(14, 2), nullable=False)
    vacancy = db.Column(db.Numeric(14, 2), nullable=False)
    other_adjustment = db.Column(db.Numeric(14, 2), nullable=False)
    effective_gross_revenue = db.Column(db.Numeric(14, 2), nullable=False)
    marketing = db.Column(db.Numeric(14, 2), nullable=False)
    administrative = db.Column(db.Numeric(14, 2), nullable=False)
    utilities = db.Column(db.Numeric(14, 2), nullable=False)
    payroll = db.Column(db.Numeric(14, 2), nullable=False)
    repair_and_maintenance = db.Column(db.Numeric(14, 2), nullable=False)
    management = db.Column(db.Numeric(14, 2), nullable=False)
    insurance = db.Column(db.Numeric(14, 2), nullable=False)
    taxes = db.Column(db.Numeric(14, 2), nullable=False)
    operating_expenses = db.Column(db.Numeric(14, 2), nullable=False)
    net_operating_income = db.Column(db.Numeric(14, 2), nullable=False)
    tenant_improvements = db.Column(db.Numeric(14, 2), nullable=False)
    leasing_commissions = db.Column(db.Numeric(14, 2), nullable=False)
    capital_reserves = db.Column(db.Numeric(14, 2), nullable=False)
    misc_capex = db.Column(db.Numeric(14, 2), nullable=False)
    capital_expenditures = db.Column(db.Numeric(14, 2), nullable=False)
    cash_flow_from_operations = db.Column(db.Numeric(14, 2), nullable=False)
    created_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now())
    updated_at = db.Column(db.TIMESTAMP(timezone=True), default=db.func.now(), onupdate=db.func.now())
    property = db.relationship('Property', backref=db.backref('incomestatement', uselist=False))
    
class PropertyMetrics(db.Model):
    __tablename__ = "property_metrics_output1"
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    purchase_price = db.Column(db.Numeric(14, 2), nullable=True) 
    dcf_value = db.Column(db.Numeric(14, 2), nullable=True) 
    replacement_cost = db.Column(db.Numeric(14, 2), nullable=True) 
    unlevered_irr = db.Column(db.Numeric(14, 2), nullable=True) 
    unlevered_equity_multiple = db.Column(db.Numeric(14, 2), nullable=True) 
    avg_free_clear_return = db.Column(db.Numeric(14, 2), nullable=True) 
    levered_irr = db.Column(db.Numeric(14, 2), nullable=True) 
    levered_equity_multiple = db.Column(db.Numeric(14,2), nullable=True)
    avg_cash_on_cash_return = db.Column(db.Numeric(14, 2), nullable=True) 
    min_dscr_noi = db.Column(db.Numeric(14, 2), nullable=True) 
    min_debt_yield_noi = db.Column(db.Numeric(14, 2), nullable=True)

class Output2(db.Model):
    __tablename__ = 'income_statement_output2'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    year_0 = db.Column(db.Numeric(14, 2), nullable=True) 
    t12 = db.Column(db.Numeric(14, 2), nullable=True)
    pro_forma = db.Column(db.Numeric(14, 2), nullable=True)
    psf_pro_forma = db.Column(db.Numeric(14, 2), nullable=True)
    year_1 = db.Column(db.String(255), nullable=False)
    year_2 = db.Column(db.String(255), nullable=False)
    year_3 = db.Column(db.String(255), nullable=False)
    year_4 = db.Column(db.String(255), nullable=False)
    year_5 = db.Column(db.String(255), nullable=False)
    year_6 = db.Column(db.String(255), nullable=False)
    year_7 = db.Column(db.String(255), nullable=False)
    year_8 = db.Column(db.String(255), nullable=False)
    year_9 = db.Column(db.String(255), nullable=False)
    year_10 = db.Column(db.String(255), nullable=False)
    year_11 = db.Column(db.String(255), nullable=False)
    # property = db.relationship('Property', backref=db.backref('output2', uselist=False))
    
class Output3(db.Model):
    __tablename__ = 'acquisition_model_output3'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    other = db.Column(db.String(255), nullable=False)
    year_0 = db.Column(db.Numeric(14, 2), nullable=True) 
    year_1 = db.Column(db.Numeric(14, 2), nullable=True)
    year_2 = db.Column(db.Numeric(14, 2), nullable=True)
    year_3 = db.Column(db.Numeric(14, 2), nullable=True)
    year_4 = db.Column(db.Numeric(14, 2), nullable=True)
    year_5 = db.Column(db.Numeric(14, 2), nullable=True)
    year_6 = db.Column(db.Numeric(14, 2), nullable=True)
    year_7 = db.Column(db.Numeric(14, 2), nullable=True)
    year_8 = db.Column(db.Numeric(14, 2), nullable=True)
    year_9 = db.Column(db.Numeric(14, 2), nullable=True)
    year_10 = db.Column(db.Numeric(14, 2), nullable=True)
    year_11 = db.Column(db.Numeric(14, 2), nullable=True)
    property = db.relationship('Property', backref=db.backref('output2', uselist=False))
    
class RentRollUnits(db.Model):
    __tablename__ = 'rent_roll_units_output5'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    unit_num = db.Column(db.String(255), nullable=False)
    year_0 = db.Column(db.Numeric(14, 2), nullable=True) 
    t12 = db.Column(db.Numeric(14, 2), nullable=True)
    pro_forma = db.Column(db.Numeric(14, 2), nullable=True)
    property = db.relationship('Property', backref=db.backref('output5_units', uselist=False))

class RentRollTotals(db.Model):
    __tablename__ = 'rent_roll_totals_output5'
    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=db.text("gen_random_uuid()"))
    property_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('properties.id'), unique=True, nullable=False)
    total_year_0 = db.Column(db.Numeric(14, 2), nullable=True) 
    total_t12 = db.Column(db.Numeric(14, 2), nullable=True)
    total_pro_forma = db.Column(db.Numeric(14, 2), nullable=True)
    property = db.relationship('Property', backref=db.backref('output5_total', uselist=False))
    
