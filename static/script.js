let formConfig = null;
let activeConfigKey = null;
let allConfigs = [];
const valuesState = {};

// shortcut for getElementById
function $(id) {
  return document.getElementById(id);
}

// show message
function setMessage(text, kind) {
  const msg = $("message");
  msg.innerText = text || "";
  msg.className =
    kind === "success"
      ? "success-message"
      : kind === "error"
      ? "error-message"
      : "";
}

// check field visibility
function isVisible(field, values) {
  const vw = field.visibleWhen;
  if (!vw) return true;
  return values[vw.fieldId] === vw.equals;
}

// get value from input
function getFieldValue(field) {
  const el = $(field.id);
  if (!el) return undefined;
  if (field.type === "checkbox") return el.checked;
  return el.value;
}

// set error text
function setFieldError(fieldId, text) {
  const errEl = document.querySelector(`#field-${fieldId} .field-error`);
  if (errEl) errEl.innerText = text || "";
}

// clear all errors
function clearAllErrors() {
  if (!formConfig) return;
  (formConfig.fields || []).forEach((f) => setFieldError(f.id, ""));
}

// validate single field
function validateField(field, value, visible) {
  if (!visible) return null;

  const required = !!field.required;
  const v = field.validation || {};

  if (required) {
    if (field.type === "checkbox") {
      if (value !== true) return "This field is required";
    } else if (field.type === "number") {
      if (value === "" || value === null || value === undefined)
        return "This field is required";
    } else {
      if (!String(value || "").trim()) return "This field is required";
    }
  }

  if (!required && (value === "" || value === null || value === undefined))
    return null;

  if (field.type === "number") {
    const num = Number(value);
    if (Number.isNaN(num)) return "Must be a number";
    if (typeof v.min === "number" && num < v.min)
      return `Must be at least ${v.min}`;
    if (typeof v.max === "number" && num > v.max)
      return `Must be at most ${v.max}`;
    return null;
  }

  const str = String(value ?? "");
  if (typeof v.minLength === "number" && str.length < v.minLength)
    return `Must be at least ${v.minLength} characters`;
  if (typeof v.maxLength === "number" && str.length > v.maxLength)
    return `Must be at most ${v.maxLength} characters`;

  if (typeof v.regex === "string" && v.regex) {
    try {
      const re = new RegExp(v.regex);
      if (!re.test(str))
        return field.id === "email"
          ? "Please enter a valid email address"
          : "Invalid format";
    } catch (_) {}
  }

  if (field.type === "select") {
    const allowed = new Set((field.options || []).map((o) => o.value));
    if (allowed.size > 0 && !allowed.has(str)) return "Invalid option";
  }

  return null;
}

// update field visibility
function updateVisibilityAndErrors() {
  if (!formConfig) return;

  (formConfig.fields || []).forEach((field) => {
    valuesState[field.id] = getFieldValue(field);
  });

  (formConfig.fields || []).forEach((field) => {
    const visible = isVisible(field, valuesState);
    const wrapper = $(`field-${field.id}`);
    if (wrapper) wrapper.style.display = visible ? "block" : "none";
    if (!visible) setFieldError(field.id, "");
  });
}

// header
function renderHeader() {
  $("formTitle").innerText = formConfig?.title || "Dynamic Form";
  const meta = [];
  if (typeof formConfig?.version !== "undefined")
    meta.push(`Version: ${formConfig.version}`);
  if (activeConfigKey) meta.push(`Config Key: ${activeConfigKey}`);
  $("formMeta").innerText = meta.join(" • ");
}

// build form dynamically
function buildForm(fields) {
  const form = $("dynamicForm");
  form.innerHTML = "";

  fields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";
    wrapper.id = "field-" + field.id;

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.innerText = field.label + (field.required ? " *" : "");
    wrapper.appendChild(label);

    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      const placeholderOpt = document.createElement("option");
      placeholderOpt.value = "";
      placeholderOpt.text = field.placeholder || "-- Select --";
      input.appendChild(placeholderOpt);

      (field.options || []).forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.text = opt.label;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type =
        field.type === "checkbox"
          ? "checkbox"
          : field.type === "number"
          ? "number"
          : "text";
      if (field.placeholder) input.placeholder = field.placeholder;
    }

    input.id = field.id;
    input.addEventListener("input", updateVisibilityAndErrors);
    input.addEventListener("change", updateVisibilityAndErrors);
    wrapper.appendChild(input);

    const err = document.createElement("div");
    err.className = "field-error";
    wrapper.appendChild(err);

    form.appendChild(wrapper);
  });

  const btn = document.createElement("button");
  btn.innerText = "Submit";
  btn.type = "submit";
  form.appendChild(btn);

  form.addEventListener("submit", submitForm);
  updateVisibilityAndErrors();
}

// load config
async function loadConfig(configKey) {
  setMessage("", "");
  clearAllErrors();

  const res = await fetch(`/api/form-config?configKey=${encodeURIComponent(configKey)}`);
  if (!res.ok) {
    setMessage("Failed to load config", "error");
    return;
  }

  formConfig = await res.json();
  activeConfigKey = configKey;
  renderHeader();
  buildForm(formConfig.fields || []);
}

// config dropdown
async function initConfigSelect() {
  const res = await fetch("/api/configs");
  const data = await res.json();

  allConfigs = data.configs || [];
  const defKey =
    data.default || (allConfigs[0] && allConfigs[0].key) || "config_v1";

  const select = $("configSelect");
  select.innerHTML = "";

  allConfigs.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.key;
    opt.text = `${c.title || c.key} (v${c.version})`;
    select.appendChild(opt);
  });

  select.value = defKey;
  select.addEventListener("change", () => loadConfig(select.value));
  await loadConfig(defKey);
}

// submit form
async function submitForm(e) {
  e.preventDefault();
  if (!formConfig || !activeConfigKey) return;

  setMessage("", "");
  clearAllErrors();
  updateVisibilityAndErrors();

  const errors = {};
  const visibleFieldIds = [];
  const payloadValues = {};

  (formConfig.fields || []).forEach((field) => {
    const value = getFieldValue(field);
    const visible = isVisible(field, valuesState);

    if (visible) visibleFieldIds.push(field.id);
    payloadValues[field.id] = value;

    const err = validateField(field, value, visible);
    if (err) errors[field.id] = err;
  });

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([fid, msg]) => setFieldError(fid, msg));
    setMessage("Please fix the highlighted errors and try again.", "error");
    return;
  }

  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      configKey: activeConfigKey,
      values: payloadValues,
      visibleFieldIds,
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const serverErrors = body.errors || {};
    Object.entries(serverErrors).forEach(([fid, msg]) => {
      if (fid === "_global") return;
      setFieldError(fid, msg);
    });
    setMessage(body.message || serverErrors._global || "Submission failed", "error");
    return;
  }

  setMessage(body.message || "Submitted successfully", "success");
}

initConfigSelect();
