 Dynamic Form Project (Flask)
 Project Overview:

This project is a dynamic form web application built using Python Flask.
The form fields are generated dynamically from a JSON configuration file, which means new fields can be added without changing frontend code.

This project demonstrates:

Backend and frontend integration

Config-driven UI generation

Input validation

Data storage using JSON

* Features:

Dynamic form rendering using JSON config file

Conditional field visibility (GST field appears only if business owner is selected)

Form validation (required fields, email format, min/max length)

Stores submitted data in a JSON file

Simple frontend using HTML, CSS, and JavaScript

 Folder Structure
TASK/
│
├── app.py              # Main Flask backend application
├── config_v1.json      # JSON configuration for dynamic form fields
├── submissions.json    # Stores submitted form data
├── requirements.txt    # Python dependencies
│
├── templates/
│   └── form.html       # HTML template for the dynamic form
│
└── static/
    ├── style.css       # CSS for UI styling
    └── script.js       # JavaScript for dynamic form rendering & validation

 How to Run the Project
Step 1: Install Python

Make sure Python 3 is installed on your system.

Check version:

python --version

Step 2: Install Dependencies

Run:
pip install flask

Step 3: Run the Server

Go to the project folder and run:

python app.py

Step 4: Open in Browser

Open:
http://127.0.0.1:5000

 Configuration File

Form fields are defined in:

config_v1.json

Example:

{
  "id": "email",
  "label": "Email",
  "type": "text",
  "required": true,
  "regex": "^[^@]+@[^@]+\\.[^@]+$"
}

 Output

Submitted form data is saved in:

submissions.json


Each submission is stored with:

Unique ID

Timestamp

User input data

** Design Approach

1.Backend (Flask) reads JSON configuration file
2.Frontend (JavaScript) dynamically creates the form
3.Backend validates data before saving
4.Required fields are validated
5.Optional fields are ignored if empty

** Future Improvements

1.Store data in database (MySQL / SQLite)
2.Add authentication (login system)
3.Improve UI using Bootstrap
4.Add admin panel to view submissions
