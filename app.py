from flask import Flask, jsonify, request, render_template
from datetime import datetime
from pathlib import Path
import json
import re
import uuid

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent

# Config files (multiple versions supported)
CONFIGS = {
    "config_v1": BASE_DIR / "config_v1.json",
    "config_v2": BASE_DIR / "config_v2.json",
}

DEFAULT_CONFIG_KEY = "config_v1"
SUBMISSION_FILE = BASE_DIR / "submissions.json"


def _read_json_file(path: Path, fallback):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return fallback


def load_config(config_key: str):
    if config_key not in CONFIGS:
        raise KeyError("Unknown config")
    config = _read_json_file(CONFIGS[config_key], None)
    if not isinstance(config, dict):
        raise ValueError("Invalid config")
    return config


def get_field_map(config: dict):
    fields = config.get("fields", [])
    if not isinstance(fields, list):
        return {}
    return {f.get("id"): f for f in fields if isinstance(f, dict) and isinstance(f.get("id"), str)}


def is_field_visible(field: dict, values: dict):
    visible_when = field.get("visibleWhen")
    if not visible_when:
        return True
    controller_id = visible_when.get("fieldId")
    expected = visible_when.get("equals")
    return values.get(controller_id) == expected


def coerce_value(field: dict, raw_value):
    field_type = field.get("type")

    if field_type == "checkbox":
        if isinstance(raw_value, bool):
            return raw_value, None
        return False, None

    if field_type == "number":
        if raw_value in ("", None):
            return None, None
        try:
            return float(raw_value), None
        except:
            return None, "Must be a number"

    if raw_value is None:
        return "", None
    return str(raw_value), None


def validate_field(field: dict, value, *, is_visible: bool):
    if not is_visible:
        return None

    required = field.get("required", False)
    validation = field.get("validation", {})

    if required:
        if value in (None, "", False):
            return "This field is required"

    if value in (None, "", False) and not required:
        return None

    if field.get("type") == "number":
        min_v = validation.get("min")
        max_v = validation.get("max")
        if min_v is not None and value < min_v:
            return f"Must be >= {min_v}"
        if max_v is not None and value > max_v:
            return f"Must be <= {max_v}"

    min_len = validation.get("minLength")
    max_len = validation.get("maxLength")
    if isinstance(min_len, int) and len(str(value)) < min_len:
        return f"Minimum {min_len} characters required"
    if isinstance(max_len, int) and len(str(value)) > max_len:
        return f"Maximum {max_len} characters allowed"

    regex = validation.get("regex")
    if regex:
        if re.match(regex, str(value)) is None:
            return "Invalid format"

    return None


@app.route("/")
def form_page():
    return render_template("form.html")


@app.route("/admin")
def admin_page():
    return render_template("admin.html")


# 🔹 List all configs (for dropdown)
@app.route("/api/configs", methods=["GET"])
def list_configs():
    configs = []
    for key, path in CONFIGS.items():
        cfg = _read_json_file(path, {})
        configs.append({
            "key": key,
            "version": cfg.get("version"),
            "title": cfg.get("title")
        })
    return jsonify({"configs": configs, "default": DEFAULT_CONFIG_KEY})


# 🔹 Get selected form config
@app.route("/api/form-config", methods=["GET"])
def get_form_config():
    config_key = request.args.get("configKey") or DEFAULT_CONFIG_KEY
    try:
        config = load_config(config_key)
    except Exception:
        return jsonify({"message": "Unknown configKey"}), 404
    return jsonify(config)


@app.route("/api/submit", methods=["POST"])
def submit_form():
    data = request.get_json() or {}
    values = data.get("values") or {}
    config_key = data.get("configKey") or DEFAULT_CONFIG_KEY

    config = load_config(config_key)
    fields = config.get("fields", [])

    coerced = {}
    errors = {}

    for field in fields:
        fid = field["id"]
        raw = values.get(fid)
        val, err = coerce_value(field, raw)
        coerced[fid] = val
        if err:
            errors[fid] = err

    visible_ids = []
    for field in fields:
        fid = field["id"]
        if is_field_visible(field, coerced):
            visible_ids.append(fid)

    for field in fields:
        fid = field["id"]
        is_visible = fid in visible_ids
        msg = validate_field(field, coerced.get(fid), is_visible=is_visible)
        if msg:
            errors[fid] = msg

    if errors:
        return jsonify({"message": "Validation failed", "errors": errors}), 400

    stored_values = {fid: coerced[fid] for fid in visible_ids}

    submission = {
        "submissionId": str(uuid.uuid4()),
        "formVersion": config.get("version"),
        "timestamp": datetime.now().isoformat(),
        "values": stored_values,
        "configKey": config_key
    }

    existing = _read_json_file(SUBMISSION_FILE, [])
    if not isinstance(existing, list):
        existing = []

    existing.append(submission)

    with open(SUBMISSION_FILE, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)

    return jsonify({"message": "Form submitted successfully"})


@app.route("/api/submissions", methods=["GET"])
def get_submissions():
    data = _read_json_file(SUBMISSION_FILE, [])
    return jsonify(data)

@app.route("/api/submissions/<submission_id>")
def get_submission_detail(submission_id):
    data = _read_json_file(SUBMISSION_FILE, [])
    if not isinstance(data, list):
        data = []

    for sub in data:
        if sub.get("submissionId") == submission_id:
            return jsonify(sub)

    return jsonify({"message": "Not found"}), 404



if __name__ == "__main__":
    app.run(debug=True)
