-- Customers table: Stores customer information
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT
);
-- Vehicles table: Stores vehicles owned by customers
CREATE TABLE Vehicles (
    vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    make_year TEXT,
    license_plate TEXT UNIQUE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
-- Service Packages table: Stores predefined service packages
CREATE TABLE Service_Packages (
    service_package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name TEXT NOT NULL,
    package_description TEXT,
    price REAL NOT NULL,
    duration INTEGER NOT NULL
);
-- Appointments table: Stores appointments for vehicle services
CREATE TABLE Appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    service_package_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT CHECK (
        status IN ('scheduled', 'completed', 'cancelled')
    ) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id),
    FOREIGN KEY (service_package_id) REFERENCES Service_Packages(service_package_id)
);
-- Employees table: Stores employees assigned to services
CREATE TABLE Employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1
);
-- Service Records table: Tracks service details of each appointment
CREATE TABLE Service_Records (
    service_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    employee_id INTEGER,
    details TEXT,
    duration INTEGER,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);
-- Inventory table: Tracks inventory details for service usage
CREATE TABLE Inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    reorder_level INTEGER NOT NULL
);
-- ServiceRecord_Inventory table: Tracks inventory usage in services
CREATE TABLE ServiceRecord_Inventory (
    service_record_id INTEGER NOT NULL,
    inventory_id INTEGER NOT NULL,
    quantity_used INTEGER NOT NULL,
    PRIMARY KEY (service_record_id, inventory_id),
    FOREIGN KEY (service_record_id) REFERENCES Service_Records(service_record_id),
    FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id)
);
-- Feedback table: Tracks feedback for completed appointments
CREATE TABLE Feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    rating INTEGER CHECK (
        rating BETWEEN 1 AND 5
    ),
    comments TEXT,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);