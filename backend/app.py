from flask import Flask, request, jsonify
from database import init_db
from flask_cors import CORS
from models import (
    add_customer, get_customers, update_customer, delete_customer, add_vehicle, get_vehicles_by_customer,
    add_service_package, get_service_packages, add_appointment, get_appointments, get_monthly_appointments,
    add_inventory, get_inventory, update_inventory,
    add_employee, get_employees,
    add_schedule_appointment, get_service_chart_data, inventory_usage, get_appointments_today, get_low_inventory, get_upcoming_appointments
)
import json

app = Flask(__name__)
CORS(app)

# Initialize the database during app startup
with app.app_context():
    init_db()

# Routes for Customers
@app.route('/customers', methods=['GET', 'POST'])
def customers():
    if request.method == 'POST':
        data = request.json
        add_customer(data['name'], data['email'], data['phone'], data['address'])
        return jsonify({'message': 'Customer added successfully', 'data': data}), 201
    else:
        customers = get_customers()
        return jsonify([dict(customer) for customer in customers])
    
@app.route('/customers/<int:customer_id>', methods=['PUT', 'DELETE'])
def update_customer_data(customer_id):
    if request.method == 'DELETE':
        delete_customer(customer_id)
        return jsonify({'message': 'Customer deleted successfully'}), 201
    data = request.json
    update_customer(customer_id, data['name'], data['email'], data['phone'], data['address'])
    return jsonify({'message': 'Customer updated successfully', 'data': data}), 201

@app.route('/metrics', methods=['GET'])
def metrics():
    customers = get_customers()
    vehicles = get_vehicles_by_customer(None)
    appointments = get_appointments()
    inventory = get_inventory()
    return jsonify({
        'customer_count': len(customers),
        'vehicle_count': len(vehicles),
        'appointment_count': len(appointments),
        'inventory_count': len(inventory)
    })

# Routes for Vehicles
@app.route('/customers/<int:customer_id>/vehicles', methods=['GET', 'POST'])
def vehicles(customer_id):
    if request.method == 'POST':
        data = request.json
        add_vehicle(customer_id, data['model_year'], data['license_plate'])
        return jsonify({'message': 'Vehicle added successfully'}), 201
    else:
        vehicles = get_vehicles_by_customer(customer_id)
        return jsonify([dict(vehicle) for vehicle in vehicles])
    
@app.route('/vehicles', methods=['GET', 'POST'])
def vehicles_all():
    if request.method == 'POST':
        data = request.json
        add_vehicle(data['customer_id'], data['model_year'], data['license_plate'])
        return jsonify({'message': 'Vehicle added successfully'}), 201
    else:
        vehicles = get_vehicles_by_customer(None)
        vehicles_with_customers = []
        for vehicle in vehicles:
            customer = get_customers(vehicle['customer_id'])
            vehicle_with_customer = dict(vehicle)
            vehicle_with_customer['customer_name'] = customer['name']
            vehicles_with_customers.append(vehicle_with_customer)
        return jsonify(vehicles_with_customers)

# Routes for Service Packages
@app.route('/service_packages', methods=['GET', 'POST'])
def service_packages():
    if request.method == 'POST':
        data = request.json
        add_service_package(data['package_name'], data['package_description'], data['price'], data['duration'])
        return jsonify({'message': 'Service package added successfully'}), 201
    else:
        packages = get_service_packages()
        return jsonify([dict(package) for package in packages])

# Routes for Appointments
@app.route('/appointments', methods=['GET', 'POST'])
def appointments():
    if request.method == 'POST':
        data = request.json
        add_appointment(
            data['vehicle_id'], data['service_package_id'],
            data['appointment_date'], data['appointment_time'], data.get('status', 'scheduled')
        )
        return jsonify({'message': 'Appointment created successfully'}), 201
    else:
        appointments = get_appointments()
        return jsonify([dict(appointment) for appointment in appointments])
    
# @app.route('/upcoming_appointments', methods=['GET'])
# def upcoming_appointments():
#     appointments = get_appointments()
#     return jsonify([dict(appointment) for appointment in appointments])

@app.route('/monthy_appointments', methods=['GET'])
def monthy_appointments():
    appointments = get_monthly_appointments()
    monthly_data = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for row in appointments:
        month_index = int(row['month']) - 1  # Convert '01', '02', etc. to 0-based index
        monthly_data.append({
            "name": month_names[month_index],
            "appointments": row['appointments']
        })

    return jsonify(monthly_data)
    
# Routes for Inventory
@app.route('/inventory', methods=['GET', 'POST'])
def inventory():
    if request.method == 'POST':
        data = request.json
        add_inventory(data['product_name'], data['reorder_level'], data['quantity'])
        return jsonify({'message': 'Inventory item added successfully'}), 201
    else:
        inventory = get_inventory()
        return jsonify([dict(item) for item in inventory])
    
@app.route('/inventory/<int:product_id>', methods=['PUT'])
def update_inventory_data(product_id):
    data = request.json
    update_inventory(product_id, data['product_name'], data['reorder_level'], data['quantity'])
    return jsonify({'message': 'Inventory item updated successfully'}), 201
    
# Routes for Employees
@app.route('/employees', methods=['GET', 'POST'])
def employees():
    if request.method == 'POST':
        data = request.json
        add_employee(data['name'], data['email'], data['phone'])
        return jsonify({'message': 'Employee added successfully'}), 201
    else:
        employees = get_employees()
        return jsonify([dict(employee) for employee in employees])
    
@app.route('/schedule_appointment', methods=['POST'])
def schedule_appointment():
    data = request.get_json()
    body = json.loads(data['body'])
    print(body)
    add_schedule_appointment(
        body['customer_id'], body['vehicle_id'], body['package_id'], body['employee_id'],
        body['appointment_date'], body['appointment_time'], body['service_details'],
        body['service_duration'], body['inventory_items']
    )
    return jsonify({'message': 'Appointment created successfully'}), 201

@app.route('/service-usage', methods=['GET'])
def get_service_usage():
    data = get_service_chart_data()
    service_usage = [{"name": row["name"], "value": row["value"]} for row in data]
    return jsonify(service_usage)

@app.route('/inventory-usage', methods=['GET'])
def get_inventory_usage():
    data = inventory_usage()
    inventory_usage_data = [{"name": row["name"], "value": row["value"]} for row in data]
    return jsonify(inventory_usage_data)

@app.route('/actionable-insights', methods=['GET'])
def actionable_insights():
    appointments_today = get_appointments_today()
    low_inventory = get_low_inventory()
    return jsonify({
        'appointments_today': appointments_today['appointments_today'],
        'low_inventory': low_inventory['low_inventory_items']
    })
    
@app.route('/upcoming-appointments', methods=['GET'])
def upcoming_appointments():
    appointments = get_upcoming_appointments()
    return jsonify([dict(appointment) for appointment in appointments])
# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
