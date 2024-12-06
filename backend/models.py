from database import get_db_connection
from datetime import date, timedelta

# Customer-related operations
def add_customer(name, email, phone, address):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Customers (name, email, phone, address) VALUES (%s, %s, %s, %s)",
            (name, email, phone, address),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def update_customer(customer_id, name, email, phone, address):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE Customers SET name = %s, email = %s, phone = %s, address = %s WHERE customer_id = %s",
            (name, email, phone, address, customer_id),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def delete_customer(customer_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Customers WHERE customer_id = %s", (customer_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()
        
def get_customer_id_from_name(name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT customer_id FROM Customers WHERE name = %s", (name,))
        customer = cursor.fetchone()
        return customer['customer_id']
    finally:
        cursor.close()
        conn.close()

def get_customers(customer_id=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if customer_id:
            cursor.execute("SELECT * FROM Customers WHERE customer_id = %s", (customer_id,))
            customer = cursor.fetchone()
            return customer
        else:
            cursor.execute("SELECT * FROM Customers")
            customers = cursor.fetchall()
            return customers
    finally:
        cursor.close()
        conn.close()

# Vehicle-related operations
def add_vehicle(customer_id, model_year, license_plate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Vehicles (customer_id, model_year, license_plate) VALUES (%s, %s, %s)",
            (customer_id, model_year, license_plate),
        )
        conn.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        conn.close()

def get_vehicles_by_customer(customer_id=None):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if customer_id is None:
            cursor.execute("SELECT * FROM Vehicles")
        else:
            cursor.execute("SELECT * FROM Vehicles WHERE customer_id = %s", (customer_id,))
        vehicles = cursor.fetchall()
        return vehicles
    finally:
        cursor.close()
        conn.close()
        
def get_vehicle(vehicle_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM Vehicles WHERE vehicle_id = %s", (vehicle_id,))
        vehicle = cursor.fetchone()
        return vehicle
    finally:
        cursor.close()
        conn.close()

# Service Package-related operations
def add_service_package(name, description, price, duration):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Service_Packages (package_name, package_description, price, duration) VALUES (%s, %s, %s, %s)",
            (name, description, price, duration),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def get_service_packages():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM Service_Packages")
        packages = cursor.fetchall()
        return packages
    finally:
        cursor.close()
        conn.close()

# Appointment-related operations
def add_appointment(vehicle_id, service_package_id, date, time, status="scheduled"):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Appointments (vehicle_id, service_package_id, appointment_date, appointment_time, status) VALUES (%s, %s, %s, %s, %s)",
            (vehicle_id, service_package_id, date, time, status),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def get_appointments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                Appointments.appointment_id,
                Appointments.vehicle_id,
                Appointments.service_package_id,
                Appointments.appointment_date,
                Appointments.appointment_time,
                Appointments.status,
                Vehicles.license_plate,
                Service_Packages.package_name
            FROM
                Appointments
            JOIN Vehicles ON Appointments.vehicle_id = Vehicles.vehicle_id
            JOIN Service_Packages ON Appointments.service_package_id = Service_Packages.service_package_id
        """)
        appointments = cursor.fetchall()

         # Convert non-serializable fields to strings
        for appointment in appointments:
            # Convert `appointment_date` to string
            if isinstance(appointment['appointment_date'], date):
                appointment['appointment_date'] = appointment['appointment_date'].strftime('%Y-%m-%d')

            # Convert `appointment_time` to string (timedelta to HH:MM format)
            if isinstance(appointment['appointment_time'], timedelta):
                total_seconds = appointment['appointment_time'].total_seconds()
                hours = int(total_seconds // 3600)
                minutes = int((total_seconds % 3600) // 60)
                appointment['appointment_time'] = f"{hours:02d}:{minutes:02d}"

        print(appointments)
        return appointments
    
    finally:
        cursor.close()
        conn.close()
# def get_appointments():
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)
#     try:
#         cursor.execute("SELECT * FROM Appointments WHERE status = 'scheduled'")
#         appointments = cursor.fetchall()
#         for appointment in appointments:
#             cursor.execute(
#                 "SELECT package_name FROM Service_Packages WHERE service_package_id = %s",
#                 (appointment['service_package_id'],)
#             )
#             package = cursor.fetchone()
#             cursor.execute(
#                 "SELECT license_plate FROM Vehicles WHERE vehicle_id = %s",
#                 (appointment['vehicle_id'],)
#             )
#             vehicle = cursor.fetchone()
#             appointment['package_name'] = package['package_name']
#             appointment['license_plate'] = vehicle['license_plate']
#         return appointments
#     finally:
#         cursor.close()
#         conn.close()

# Inventory-related operations
def add_inventory(product_name, quantity, reorder_level):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Inventory (product_name, quantity, reorder_level) VALUES (%s, %s, %s)",
            (product_name, quantity, reorder_level),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def get_inventory():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM Inventory")
        inventory = cursor.fetchall()
        return inventory
    finally:
        cursor.close()
        conn.close()

def update_inventory(inventory_id, product_name, reorder_level, quantity):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE Inventory SET product_name = %s, quantity = %s, reorder_level = %s WHERE inventory_id = %s",
            (product_name, quantity, reorder_level, inventory_id),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

# Employee-related operations
def add_employee(name, email, phone, is_active=True):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Employees (name, email, phone, is_active) VALUES (%s, %s, %s, %s)",
            (name, email, phone, is_active),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM Employees")
        employees = cursor.fetchall()
        return employees
    finally:
        cursor.close()
        conn.close()

def add_schedule_appointment(customer_id, vehicle_id, package_id, employee_id, date, time, service_details, service_duration, inventory_items):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Step 1: Insert into Appointments table
        cursor.execute("""
            INSERT INTO Appointments (vehicle_id, service_package_id, appointment_date, appointment_time, status)
            VALUES (%s, %s, %s, %s, %s)
        """, (vehicle_id, package_id, date, time, 'scheduled'))
        
        # Get the newly created appointment_id
        appointment_id = cursor.lastrowid

        # Step 2: Insert into Service_Records table
        cursor.execute("""
            INSERT INTO Service_Records (appointment_id, employee_id, details, duration)
            VALUES (%s, %s, %s, %s)
        """, (appointment_id, employee_id, service_details, service_duration))
        
        # Get the newly created service_record_id
        service_record_id = cursor.lastrowid

        # Step 3: Insert into ServiceRecord_Inventory table for each inventory item used
        for item in inventory_items:
            cursor.execute("""
                INSERT INTO ServiceRecord_Inventory (service_record_id, inventory_id, quantity_used)
                VALUES (%s, %s, %s)
            """, (service_record_id, item['inventory_id'], item['quantity']))
            
            # Step 4: Update inventory quantity in the Inventory table
            cursor.execute("""
                UPDATE Inventory
                SET quantity = quantity - %s
                WHERE inventory_id = %s
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
        cursor.close()
        conn.close()


def get_monthly_appointments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT MONTH(appointment_date) AS month, COUNT(*) AS appointments
            FROM Appointments
            GROUP BY month
            ORDER BY month
        """)
        appointments = cursor.fetchall()
        return appointments
    finally:
        cursor.close()
        conn.close()


def get_service_chart_data():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT Service_Packages.package_name AS name, COUNT(*) AS value
            FROM Service_Packages
            JOIN Appointments ON Service_Packages.service_package_id = Appointments.service_package_id
            GROUP BY Service_Packages.package_name
        """)
        data = cursor.fetchall()
        return data
    finally:
        cursor.close()
        conn.close()


def inventory_usage():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT
                Inventory.product_name AS name,
                SUM(ServiceRecord_Inventory.quantity_used) AS value
            FROM
                ServiceRecord_Inventory
            JOIN
                Inventory ON ServiceRecord_Inventory.inventory_id = Inventory.inventory_id
            GROUP BY
                Inventory.product_name
        """)
        data = cursor.fetchall()
        return data
    finally:
        cursor.close()
        conn.close()

def get_appointments_today():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT COUNT(*) AS appointments_today
            FROM Appointments
            WHERE appointment_date = CURDATE()
        """)
        appointments = cursor.fetchone()
        return appointments
    finally:
        cursor.close()
        conn.close()


def get_low_inventory():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT COUNT(*) AS low_inventory_items
            FROM Inventory
            WHERE quantity < reorder_level
        """)
        inventory = cursor.fetchone()
        return inventory
    finally:
        cursor.close()
        conn.close()


def get_upcoming_appointments():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT
                CONCAT(Appointments.appointment_date, ' ', Appointments.appointment_time) AS date_time,
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
                Appointments.appointment_date >= CURDATE()
            ORDER BY
                Appointments.appointment_date ASC,
                Appointments.appointment_time ASC
        """)
        appointments = cursor.fetchall()
        return appointments
    finally:
        cursor.close()
        conn.close()

