
# Auto Detailing Company Management System

This project consists of:
1. **Backend**: A Flask application to manage APIs and connect to the database.
2. **Database**: A MySQL database to store application data.
3. **Frontend**: A Next.js application for user interaction.

## Prerequisites

Ensure you have the following installed:
- **Python** (version 3.8 or later)
- **MySQL** (version 8.0 or later)
- **Node.js** (version 14 or later) with npm or yarn
- **Git**

## Installation

### 1. Setting Up the Backend

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### 2. Configure the Database

Create the Database

```bash
mysql -u your_mysql_username -p
CREATE DATABASE auto_detailing;
SHOW DATABASES;
```

Create a .env file in the backend directory with the following content:

```bash
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=auto_detailing
```

### 3. Start the Backend Server

```bash
python app.py
The server will be available at http://127.0.0.1:5000.
```

## 3. Setting Up the Frontend
```bash
cd ../frontend
npm install
npm run dev
```



