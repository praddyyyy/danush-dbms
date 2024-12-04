from database import get_db_connection

# Customer-related operations
def add_customer(name, email, phone, address):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Customers (name, email, phone, address) VALUES (?, ?, ?, ?)",
        (name, email, phone, address),
    )
    conn.commit()
    conn.close()
    
def update_customer(customer_id, name, email, phone, address):
    conn = get_db_connection()
    conn.execute(
        "UPDATE Customers SET name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?",
        (name, email, phone, address, customer_id),
    )
    conn.commit()
    conn.close()
    
def delete_customer(customer_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM Customers WHERE customer_id = ?", (customer_id,))
    conn.commit()
    conn.close()

def get_customers(vehicle_id=None):
    if vehicle_id:
        conn = get_db_connection()
        customer_id = conn.execute("SELECT customer_id FROM Vehicles WHERE customer_id = ?", (vehicle_id,)).fetchone()[0]
        customer = conn.execute("SELECT * FROM Customers WHERE customer_id = ?", (customer_id,)).fetchone()
        conn.close()
        return customer
    conn = get_db_connection()
    customers = conn.execute("SELECT * FROM Customers").fetchall()
    conn.close()
    return customers

# Vehicle-related operations
def add_vehicle(customer_id, model_year, license_plate):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Vehicles (customer_id, model_year, license_plate) VALUES (?, ?, ?)",
        (customer_id, model_year, license_plate),
    )
    conn.commit()
    conn.close()

def get_vehicles_by_customer(customer_id):
    conn = get_db_connection()
    if customer_id is None:
        vehicles = conn.execute("SELECT * FROM Vehicles").fetchall()
    else:
        vehicles = conn.execute(
            "SELECT * FROM Vehicles WHERE customer_id = ?", (customer_id,)
        ).fetchall()
    conn.close()
    return vehicles

# Service Package-related operations
def add_service_package(name, description, price, duration):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Service_Packages (package_name, package_description, price, duration) VALUES (?, ?, ?, ?)",
        (name, description, price, duration),
    )
    conn.commit()
    conn.close()

def get_service_packages():
    conn = get_db_connection()
    packages = conn.execute("SELECT * FROM Service_Packages").fetchall()
    conn.close()
    return packages

# Appointment-related operations
def add_appointment(vehicle_id, service_package_id, date, time, status="scheduled"):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Appointments (vehicle_id, service_package_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
        (vehicle_id, service_package_id, date, time, status),
    )
    conn.commit()
    conn.close()

def get_appointments():
    conn = get_db_connection()
    appointments = conn.execute("SELECT * FROM Appointments WHERE status = 'scheduled'").fetchall()
    # return service package name and vechile license plate number
    appointments = [dict(appointment) for appointment in appointments]
    for appointment in appointments:
        package = conn.execute(
            "SELECT package_name FROM Service_Packages WHERE service_package_id = ?",
            (appointment['service_package_id'],)
        ).fetchone()
        vehicle = conn.execute(
            "SELECT license_plate FROM Vehicles WHERE vehicle_id = ?",
            (appointment['vehicle_id'],)
        ).fetchone()
        appointment['package_name'] = package[0]
        appointment['license_plate'] = vehicle[0]
    conn.close()
    return appointments

# Inventory-related operations
def add_inventory(product_name, quantity, reorder_level):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Inventory (product_name, quantity, reorder_level) VALUES (?, ?, ?)",
        (product_name, quantity, reorder_level),
    )
    conn.commit()
    conn.close()
    
def get_inventory():
    conn = get_db_connection()
    inventory = conn.execute("SELECT * FROM Inventory").fetchall()
    conn.close()
    return inventory

def update_inventory(inventory_id, product_name, reorder_level, quantity):
    conn = get_db_connection()
    conn.execute(
        "UPDATE Inventory SET product_name = ?, quantity = ?, reorder_level = ? WHERE inventory_id = ?",
        (product_name, quantity, reorder_level, inventory_id),
    )
    conn.commit()
    conn.close()

# Employee-related operations
def add_employee(name, email, phone, is_active=True):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO Employees (name, email, phone, is_active) VALUES (?, ?, ?, ?)",
        (name, email, phone, is_active),
    )
    conn.commit()
    conn.close()
    
def get_employees():
    conn = get_db_connection()
    employees = conn.execute("SELECT * FROM Employees").fetchall()
    conn.close()
    return employees

def add_schedule_appointment(customer_id, vehicle_id, package_id, employee_id, date, time, service_details, service_duration, inventory_items):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Step 1: Insert into Appointments table
        cursor.execute("""
            INSERT INTO Appointments (vehicle_id, service_package_id, appointment_date, appointment_time, status)
            VALUES (?, ?, ?, ?, ?)
        """, (vehicle_id, package_id, date, time, 'scheduled'))
        
        # Get the newly created appointment_id
        appointment_id = cursor.lastrowid

        # Step 2: Insert into Service_Records table
        cursor.execute("""
            INSERT INTO Service_Records (appointment_id, employee_id, details, duration)
            VALUES (?, ?, ?, ?)
        """, (appointment_id, employee_id, service_details, service_duration))
        
        # Get the newly created service_record_id
        service_record_id = cursor.lastrowid

        # Step 3: Insert into ServiceRecord_Inventory table for each inventory item used
        for item in inventory_items:
            cursor.execute("""
                INSERT INTO ServiceRecord_Inventory (service_record_id, inventory_id, quantity_used)
                VALUES (?, ?, ?)
            """, (service_record_id, item['inventory_id'], item['quantity']))
            
            # Step 4: Update inventory quantity in the Inventory table
            cursor.execute("""
                UPDATE Inventory
                SET quantity = quantity - ?
                WHERE inventory_id = ?
            """, (item['quantity'], item['inventory_id']))
        
        # Commit the transaction
        conn.commit()

        print(f"Appointment {appointment_id} scheduled successfully.")
    except Exception as e:
        # Rollback if any error occurs
        conn.rollback()
        print(f"Error scheduling appointment: {e}")
    finally:
        # Close the connection
        conn.close()

def get_monthly_appointments():
    conn = get_db_connection()
    appointments = conn.execute("SELECT strftime('%m', appointment_date) AS month, COUNT(*) AS appointments FROM Appointments GROUP BY month ORDER BY month").fetchall()
    conn.close()
    return appointments

def get_service_chart_data():
    conn = get_db_connection()
    data = conn.execute("""
        SELECT Service_Packages.package_name AS name, COUNT(*) AS value
        FROM Service_Packages
        JOIN Appointments ON Service_Packages.service_package_id = Appointments.service_package_id
        GROUP BY Service_Packages.package_name;
    """).fetchall()
    conn.close()
    return data

def inventory_usage():
    conn = get_db_connection()
    data = conn.execute("""
        SELECT
            Inventory.product_name AS name,
            SUM(ServiceRecord_Inventory.quantity_used) AS value
        FROM
            ServiceRecord_Inventory
        JOIN
            Inventory ON ServiceRecord_Inventory.inventory_id = Inventory.inventory_id
        GROUP BY
            Inventory.product_name;
    """).fetchall()
    conn.close()
    return data

def get_appointments_today():
    conn = get_db_connection()
    appointments = conn.execute("SELECT COUNT(*) AS appointments_today FROM Appointments WHERE appointment_date = date('now')").fetchone()
    conn.close()
    return appointments

def get_low_inventory():
    conn = get_db_connection()
    inventory = conn.execute("SELECT COUNT(*) AS low_inventory_items FROM Inventory WHERE quantity < reorder_level").fetchone()
    conn.close()
    return inventory

def get_upcoming_appointments():
    conn = get_db_connection()
    appointments = conn.execute(
        """
        SELECT
    Appointments.appointment_date || ' ' || Appointments.appointment_time AS date_time,
    Customers.name AS customer,
    Vehicles.license_plate AS vehicle,
    Service_Packages.package_name AS service,
    Appointments.status AS status
FROM
    Appointments
JOIN
    Vehicles ON Appointments.vehicle_id = Vehicles.vehicle_id
JOIN
    Customers ON Vehicles.customer_id = Customers.customer_id
JOIN
    Service_Packages ON Appointments.service_package_id = Service_Packages.service_package_id
WHERE
    date(Appointments.appointment_date) >= date('now')
ORDER BY
    Appointments.appointment_date ASC,
    Appointments.appointment_time ASC;
        """
        ).fetchall()
    conn.close()
    return appointments
