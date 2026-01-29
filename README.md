# Dynamic Form Project (Flask)

## Project Overview
This project is a dynamic form web application built using Python Flask.  
The form UI is generated dynamically from a JSON configuration file, which means new fields can be added or modified without changing the frontend code.

The goal of this project is to demonstrate:
- Backend and frontend integration
- Config-driven UI generation
- Input validation
- Data storage using JSON
- Simple admin panel to view submitted data

---

## Features
- Dynamic form rendering using JSON config file  
- Conditional field visibility (example: GST field appears only when Business Account is selected)  
- Client-side and server-side validation  
- Stores submitted form data in a JSON file  
- Admin panel to view and search submissions  
- Supports multiple form versions using different config files  

---

## Folder Structure
TASK/
│
├── app.py
├── config_v1.json
├── config_v2.json
├── submissions.json
├── requirements.txt
│
├── templates/
│ ├── form.html
│ └── admin.html
│
└── static/
├── style.css
├── script.js
└── admin.js


---

## Setup Instructions

### Step 1: Install Python
Make sure Python 3 is installed.

Check version:

---

### Step 2: Install dependencies

---

### Step 3: Run the server
Go to the project folder and run:
### Step 4: Open in browser
Form page:
http://127.0.0.1:5000


Admin panel:
http://127.0.0.1:5000/admin
---

## Configuration Files

Form fields are defined in JSON files:
- `config_v1.json`
- `config_v2.json`

Each config contains:
- version
- title
- fields array

To switch form versions:
Open app.py
Locate:
DEFAULT_CONFIG_KEY = "config_v1"
Change it to:
DEFAULT_CONFIG_KEY = "config_v2"

Design Decisions & Tradeoffs

**Decisions

Used JSON instead of database for form structure to keep system flexible

Used Flask for simplicity and readability

Stored submissions in submissions.json to avoid database dependency

Performed validation on both frontend (JavaScript) and backend (Flask)

**Tradeoffs

JSON file storage is simple but not scalable for large data

No authentication implemented for admin panel

UI is kept simple to focus on functionality

No concurrency handling for file writes 

** Assumptions

Single user or low traffic usage

JSON config file structure is valid

Admin panel is used for demo/testing purposes

Application is run locally (localhost)

No authentication is required

Form fields are controlled only via config file

** Future Improvements

Store data in database (MySQL / SQLite)

Add authentication system

Improve UI using Bootstrap

Add export to CSV feature

Add pagination in admin panel



