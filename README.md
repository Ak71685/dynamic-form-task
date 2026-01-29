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
├── app.py              
├── config_v1.json      
├── submissions.json    
├── requirements.txt    
│
├── templates/
│   └── form.html       
│
└── static/
    ├── style.css       
    └── script.js       

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

Backend (Flask) reads JSON configuration file

Frontend (JavaScript) dynamically creates the form

Backend validates data before saving

Required fields are validated

Optional fields are ignored if empty

*** How to Switch Config Versions

If multiple config files are added (example: config_v2.json):

Open app.py

Change:

CONFIG_FILE = "config_v1.json"


to:

CONFIG_FILE = "config_v2.json"


Restart server:

python app.py

**Design Decisions & Trade-offs

*Decisions:

Used JSON instead of hardcoded HTML inputs for flexibility

Used Flask for simple backend routing

Used vanilla JavaScript for frontend logic

Stored data in JSON file for simplicity

* Trade-offs:

JSON file used instead of database 

No authentication implemented 

Minimal UI 

** Assumptions

Application will be run locally

Single user usage at a time

JSON config format will remain consistent

Data size will be small 

** Future Improvements

Store data in database (MySQL / SQLite)

Add authentication (login system)

Improve UI using Bootstrap

Add admin panel to view submissions
