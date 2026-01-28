                                                                           Dynamic Form Project (Flask)
**Project Overview**
This project is a dynamic form web application built using Python Flask.
The form fields are generated dynamically from a JSON configuration file, so new fields can be added without changing the frontend code.

The project demonstrates:

1.Backend and frontend integration
2.Config-driven UI generation
3.Input validation
4.Data storage using JSON

Features:

1.Dynamic form rendering using JSON config file
2.Conditional field visibility (GST field appears only if business owner is selected)
3.Form validation (required fields, email format, min/max length)
4.Stores submitted data in a JSON file
5.Simple frontend using HTML, CSS, and JavaScript

#Folder Structure:
TASK/
│
├── app.py              # Main Flask backend application
├── config_v1.json      # JSON configuration for dynamic form fields
├── submissions.json   # Stores submitted form data
├── requirements.txt   # Python dependencies
│
├── templates/
│   └── form.html       # HTML template for the dynamic form
│
└── static/
    ├── style.css       # CSS for styling the form UI
    └── script.js       # JavaScript for dynamic form rendering & validation

* Step 1: Install Python

Make sure Python 3 is installed on your system.

Check version:

python --version

* Step 2: Install dependencies

Run: pip install flask

* Step 3: Run the server

Go to project folder and run:

python app.py


* Step 4: Open in browser

Open:
http://127.0.0.1:5000 (Port number)

*** Configuration File

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


* Output

Submitted form data is saved in:

submissions.json

Each submission is stored with a unique ID and timestamp.

*** Design Approach

1.Backend (Flask) reads JSON config and sends it to frontend
2.Frontend (JavaScript) creates form dynamically
3.Backend validates data before saving
4.Required fields are validated
5.Optional fields are ignored if empty

Future Improvements

1.Store data in database (MySQL / SQLite)
2.Add authentication (login system)
3.Improve UI using Bootstrap
4.Add admin panel to view submissions
