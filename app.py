from flask import Flask, jsonify, request, render_template
import json
import uuid
from datetime import datetime

app = Flask(__name__)

CONFIG_FILE = "config_v1.json"
SUBMISSION_FILE = "submissions.json"


@app.route("/")
def form_page():
    return render_template("form.html")


@app.route("/admin")
def admin_page():
    return render_template("admin.html")


@app.route("/api/form-config", methods=["GET"])
def get_form_config():
    with open(CONFIG_FILE, "r") as f:
        config = json.load(f)
    return jsonify(config)


@app.route("/api/submit", methods=["POST"])
def submit_form():
    data = request.json

    submission = {
        "submissionId": str(uuid.uuid4()),
        "formVersion": data.get("formVersion"),
        "timestamp": datetime.now().isoformat(),
        "values": data.get("values"),
        "visibleFieldIds": data.get("visibleFieldIds")
    }

    try:
        with open(SUBMISSION_FILE, "r") as f:
            existing = json.load(f)
    except:
        existing = []

    existing.append(submission)

    with open(SUBMISSION_FILE, "w") as f:
        json.dump(existing, f, indent=2)

    return jsonify({"message": "Form submitted successfully"})


@app.route("/api/submissions", methods=["GET"])
def get_submissions():
    try:
        with open(SUBMISSION_FILE, "r") as f:
            data = json.load(f)
    except:
        data = []
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
