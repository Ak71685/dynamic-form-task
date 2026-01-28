# Dynamic Form Project (Flask)

This is a dynamic form web application built using Python Flask.  
The form fields are generated dynamically from a JSON configuration file instead of being hardcoded in HTML.

---

## Features

- Dynamic form rendering from JSON configuration
- Conditional field visibility (GST field appears only when Business Account is selected)
- Client-side and server-side validation
- Stores submitted form data in a JSON file
- Simple and clean UI using HTML, CSS, and JavaScript
- Backend built with Flask

---

## Folder Structure

TASK/
│
├── app.py
├── config_v1.json
├── submissions.json
├── requirements.txt
│
├── templates/
│ └── form.html
│
└── static/
├── style.css
└── script.js



---

## How to Run the Project

### Step 1: Install Python  
Make sure Python 3 is installed on your system.

Check version:

---

### Step 2: Install dependencies

Open terminal in project folder and run:

---

### Step 3: Run the server


You should see:
Running on http://127.0.0.1:5000
---

### Step 4: Open in browser

Open this URL in browser:http://127.0.0.1:5000

---

## Configuration File

Form fields are defined in:

## config_v1.json

This file controls:
- Field labels
- Field types (text, number, checkbox, select)
- Validation rules
- Conditional visibility

No changes are needed in HTML to add new fields.  
Only updating the JSON file is enough.

---

## Output

Submitted form data is stored in: submissions.json

## submissions.json
Each submission is saved with a unique ID and timestamp.

---

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- JSON

---

## Author

**Arohi Kumar**  



