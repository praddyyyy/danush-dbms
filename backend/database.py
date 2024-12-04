import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_NAME = os.getenv("DATABASE_NAME")

def table_exists(connection, table_name):
    """Checks if a table exists in the database."""
    query = "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
    result = connection.execute(query, (table_name,)).fetchone()
    return result is not None

def init_db():
    """Initializes the database only if tables are missing."""
    connection = sqlite3.connect(DATABASE_NAME)

    # Check for tables and create them if they don't exist
    if not table_exists(connection, 'Customers'):
        connection.execute('''
        CREATE TABLE Customers (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            address TEXT
        )
        ''')

    if not table_exists(connection, 'Vehicles'):
        connection.execute('''
        CREATE TABLE Vehicles (
            vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            model_year TEXT,
            license_plate TEXT UNIQUE NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        )
        ''')

    if not table_exists(connection, 'Service_Packages'):
        connection.execute('''
        CREATE TABLE Service_Packages (
            service_package_id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_name TEXT NOT NULL,
            package_description TEXT,
            price REAL NOT NULL,
            duration INTEGER NOT NULL
        )
        ''')

    if not table_exists(connection, 'Appointments'):
        connection.execute('''
        CREATE TABLE Appointments (
            appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_id INTEGER NOT NULL,
            service_package_id INTEGER NOT NULL,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) NOT NULL,
            FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
            FOREIGN KEY (service_package_id) REFERENCES Service_Packages(service_package_id)
        )
        ''')

    if not table_exists(connection, 'Employees'):
        connection.execute('''
        CREATE TABLE Employees (
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            is_active BOOLEAN NOT NULL DEFAULT 1
        )
        ''')

    if not table_exists(connection, 'Service_Records'):
        connection.execute('''
        CREATE TABLE Service_Records (
            service_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER NOT NULL,
            employee_id INTEGER,
            details TEXT,
            duration INTEGER,
            FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
            FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        )
        ''')

    if not table_exists(connection, 'Inventory'):
        connection.execute('''
        CREATE TABLE Inventory (
            inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            reorder_level INTEGER NOT NULL
        )
        ''')

    if not table_exists(connection, 'ServiceRecord_Inventory'):
        connection.execute('''
        CREATE TABLE ServiceRecord_Inventory (
            service_record_id INTEGER NOT NULL,
            inventory_id INTEGER NOT NULL,
            quantity_used INTEGER NOT NULL,
            PRIMARY KEY (service_record_id, inventory_id),
            FOREIGN KEY (service_record_id) REFERENCES Service_Records(service_record_id),
            FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id)
        )
        ''')

    if not table_exists(connection, 'Feedback'):
        connection.execute('''
        CREATE TABLE Feedback (
            feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
            appointment_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            rating INTEGER CHECK (rating BETWEEN 1 AND 5),
            comments TEXT,
            FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
            FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        )
        ''')

    connection.close()
    print("Database initialized (only missing tables were created).")


def get_db_connection():
    """Establishes a database connection."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row  # Allows fetching rows as dictionaries
    return conn