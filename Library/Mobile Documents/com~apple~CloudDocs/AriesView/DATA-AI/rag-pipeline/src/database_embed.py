import psycopg2
import psycopg2.extras
import json
import weaviate
from datetime import datetime, timezone
from weaviate.classes.data import DataObject


def fetch_user_data(user_id): # Fetch user and related property data from the database
    data = {}
    conn = psycopg2.connect(
            host="20.42.16.162",
            port=4432,
            database="ariesview-dev",
            user="postgres",
            password="admin"
        )
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)


    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    data['user'] = cursor.fetchone()


    cursor.execute("SELECT * FROM properties WHERE user_ref_id = %s", (user_id,))
    properties = cursor.fetchall()
    data['properties'] = properties

    data['financials'] = []
    data['income_items'] = []
    data['expense_items'] = []
    data['loans'] = []
    data['acquisition_costs'] = []
    data['financial_assumptions'] = []
    data['capex_settings'] = []
    data['capital_projects'] = []
    data['cash_flow_yearly'] = []
    data['cash_flow_monthly'] = []
    data['operating_assumptions'] = []
    data['superior_interest_holders'] = []
    data['units'] = []
    data['leases'] = []
    data['lease_information'] = []
    data['lease_legal_consents'] = []
    data['lease_operation_rights'] = []
    data['financial_obligations_units'] = []


    property_ids = [prop['id'] for prop in properties]
    for pid in property_ids:
        cursor.execute("SELECT * FROM financial_property_details WHERE property_id = %s", (pid,))
        data.setdefault('financials', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_income_items WHERE property_id = %s", (pid,))
        data.setdefault('income_items', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_expense_items WHERE property_id = %s", (pid,))
        data.setdefault('expense_items', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_loans WHERE property_id = %s", (pid,))
        data.setdefault('loans', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_acquisition_costs WHERE property_id = %s", (pid,))
        data.setdefault('acquisition_costs', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_assumptions WHERE property_id = %s", (pid,))
        data.setdefault('financial_assumptions', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_capex_settings WHERE property_id = %s", (pid,))
        data.setdefault('capex_settings', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_capital_projects WHERE property_id = %s", (pid,))
        data.setdefault('capital_projects', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_cash_flow_projections_yearly WHERE property_id = %s", (pid,))
        data.setdefault('cash_flow_yearly', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_cash_flow_projections_monthly WHERE property_id = %s", (pid,))
        data.setdefault('cash_flow_monthly', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_operating_assumptions WHERE property_id = %s", (pid,))
        data.setdefault('operating_assumptions', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM superior_interest_holders WHERE property_id = %s", (pid,))
        data.setdefault('superior_interest_holders', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM units WHERE property_id = %s", (pid,))
        data.setdefault('units', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_leases WHERE unit_id IN (SELECT id FROM units WHERE property_id = %s)", (pid,))
        data.setdefault('leases', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM core_lease_information WHERE parent_property = %s", (pid,))
        data.setdefault('lease_information', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM core_lease_legal_consents WHERE unit_id IN (SELECT id FROM units WHERE property_id = %s)", (pid,))
        data.setdefault('lease_legal_consents', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM core_lease_operations_rights WHERE unit_id IN (SELECT id FROM units WHERE property_id = %s)", (pid,))
        data.setdefault('lease_operation_rights', []).extend(cursor.fetchall())

        cursor.execute("SELECT * FROM financial_obligations_units WHERE unit_id IN (SELECT id FROM units WHERE property_id = %s)", (pid,))
        data.setdefault('financial_obligations_units', []).extend(cursor.fetchall())



    cursor.close()
    conn.close()
    
    return data

def format_data(user_data): # Convert fetched data into a readable string
    information = []
    user = user_data.get('user', {})

    financials = user_data.get('financials', [])
    income_items = user_data.get('income_items', [])
    expense_items = user_data.get('expense_items', [])


    if user:
        information.append(f"User Name: {user.get('name')}, Email: {user.get('email')}")
    
    for prop in user_data.get('properties', []):
        information.append(f"Property ID: {prop.get('id')}, Address: {prop.get('address')}, Type: {prop.get('type')}")
        prop_id = prop.get('id')
        prop_financials = [f for f in financials if f['property_id'] == prop_id]
        if prop_financials:
            information.append("  Financial Details:")
            for f in prop_financials:
                for key, value in f.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_income = [i for i in income_items if i['property_id'] == prop_id]
        if prop_income:
            information.append("  Income Items:")
            for i in prop_income:
                for key, value in i.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")

        prop_expenses = [e for e in expense_items if e['property_id'] == prop_id]
        if prop_expenses:
            information.append("  Expense Items:")
            for e in prop_expenses:
                for key, value in e.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")

        prop_loans = [l for l in user_data.get('loans', []) if l['property_id'] == prop_id]
        if prop_loans:
            information.append("  Loans:")
            for l in prop_loans:
                for key, value in l.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_acquisition_costs = [a for a in user_data.get('acquisition_costs', []) if a['property_id'] == prop_id]
        if prop_acquisition_costs:
            information.append("  Acquisition Costs:")
            for a in prop_acquisition_costs:
                for key, value in a.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_financial_assumptions = [fa for fa in user_data.get('financial_assumptions', []) if fa['property_id'] == prop_id]
        if prop_financial_assumptions:
            information.append("  Financial Assumptions:")
            for fa in prop_financial_assumptions:
                for key, value in fa.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_capex_settings = [cs for cs in user_data.get('capex_settings', []) if cs['property_id'] == prop_id]
        if prop_capex_settings:
            information.append("  CapEx Settings:")
            for cs in prop_capex_settings:
                for key, value in cs.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_capital_projects = [cp for cp in user_data.get('capital_projects', []) if cp['property_id'] == prop_id]
        if prop_capital_projects:
            information.append("  Capital Projects:")
            for cp in prop_capital_projects:
                for key, value in cp.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_cash_flow_yearly = [cfy for cfy in user_data.get('cash_flow_yearly', []) if cfy['property_id'] == prop_id]
        if prop_cash_flow_yearly:
            information.append("  Cash Flow Yearly:")
            for cfy in prop_cash_flow_yearly:
                for key, value in cfy.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_cash_flow_monthly = [cfm for cfm in user_data.get('cash_flow_monthly', []) if cfm['property_id'] == prop_id]
        if prop_cash_flow_monthly:
            information.append("  Cash Flow Monthly:")
            for cfm in prop_cash_flow_monthly:
                for key, value in cfm.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        
        prop_operating_assumptions = [oa for oa in user_data.get('operating_assumptions', []) if oa['property_id'] == prop_id]
        if prop_operating_assumptions:
            information.append("  Operating Assumptions:")
            for oa in prop_operating_assumptions:
                for key, value in oa.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")


        prop_superior_interest_holders = [sih for sih in user_data.get('superior_interest_holders', []) if sih['property_id'] == prop_id]
        if prop_superior_interest_holders:
            information.append("  Superior Interest Holders:")
            for sih in prop_superior_interest_holders:
                for key, value in sih.items():
                    if key != 'property_id':
                        information.append(f"    {key}: {value}")
        

    return "\n".join(information)

def store_in_weaviate(collection, user_data, summary_text, vector): # Store the formatted data and its embedding in Weaviate
    user = user_data['user']
    
    if hasattr(vector, "tolist"):
        vector = vector.tolist()

    properties = {
        "user_id": str(user['id']),
        "email": user['email'],
        "display_name": user['display_name'],
        "role": user['user_role'],
        "summary": summary_text,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "tags": []
    }

    data_object = DataObject(
        properties=properties,
        vector=vector
    )

    collection.data.insert_many([data_object])



