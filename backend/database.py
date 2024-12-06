from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()

DATABASE_NAME = os.getenv("DATABASE_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

def init_db():
    """Initializes the database only if tables are missing (MySQL version)."""
    connection = mysql.connector.connect(
        host='localhost',
        user=DB_USER,
        password=DB_PASSWORD,   
        database=DATABASE_NAME        
    )
    cursor = connection.cursor()

    # Create Customers table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT
    )
    ''')

    # Create Vehicles table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Vehicles (
        vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        model_year VARCHAR(4),
        license_plate VARCHAR(255) UNIQUE NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    ''')

    # Create Service_Packages table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Service_Packages (
        service_package_id INT AUTO_INCREMENT PRIMARY KEY,
        package_name VARCHAR(255) NOT NULL,
        package_description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL
    )
    ''')

    # Create Appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    service_package_id INT NULL, -- Allow NULL values for ON DELETE SET NULL
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_package_id) REFERENCES Service_Packages(service_package_id)
    ON DELETE SET NULL ON UPDATE CASCADE
    )
    ''')

    # Create Employees table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Employees (
        employee_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        is_active BOOLEAN NOT NULL DEFAULT TRUE
    )
    ''')

    # Create Service_Records table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Service_Records (
        service_record_id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        employee_id INT,
        details TEXT,
        duration INT,
        FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    )
    ''')

    # Create Inventory table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Inventory (
        inventory_id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        reorder_level INT NOT NULL
    )
    ''')

    # Create ServiceRecord_Inventory table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ServiceRecord_Inventory (
        service_record_id INT NOT NULL,
        inventory_id INT NOT NULL,
        quantity_used INT NOT NULL,
        PRIMARY KEY (service_record_id, inventory_id),
        FOREIGN KEY (service_record_id) REFERENCES Service_Records(service_record_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    ''')

    # Create Feedback table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Feedback (
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        customer_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    )
    ''')

    connection.commit()
    cursor.close()
    connection.close()
    print("Database initialized (only missing tables were created).")

def get_db_connection():
    conn = mysql.connector.connect(
        host='localhost',
        user=DB_USER,
        password=DB_PASSWORD,   
        database=DATABASE_NAME        
    )
    return conn