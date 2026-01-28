let formConfig = null;

fetch("/api/form-config")
  .then(res => res.json())
  .then(config => {
    formConfig = config;
    buildForm(config.fields);
  });

function buildForm(fields) {
  const form = document.getElementById("dynamicForm");
  form.innerHTML = "";

  fields.forEach(field => {
    const div = document.createElement("div");
    div.id = "field-" + field.id;

    const label = document.createElement("label");
    label.innerText = field.label + (field.required ? " *" : "");
    div.appendChild(label);

    let input;

    if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.value;
        option.text = opt.label;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type;
    }

    input.id = field.id;
    input.placeholder = "Enter " + field.label;
    div.appendChild(input);

    // Hide GST field initially
    if (field.id === "gstNumber") {
      div.style.display = "none";
    }

    form.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.innerText = "Submit";
  btn.type = "submit";
  form.appendChild(btn);

  // Checkbox logic for GST show/hide
  const businessCheckbox = document.getElementById("isBusiness");
  if (businessCheckbox) {
    businessCheckbox.addEventListener("change", () => {
      const gstDiv = document.getElementById("field-gstNumber");
      gstDiv.style.display = businessCheckbox.checked ? "block" : "none";
    });
  }

  form.addEventListener("submit", submitForm);
}

function submitForm(e) {
  e.preventDefault();

  const values = {};
  const visibleFields = [];

  formConfig.fields.forEach(field => {
    const el = document.getElementById(field.id);
    const div = document.getElementById("field-" + field.id);

    if (div.style.display !== "none") {
      if (field.required && !el.value && el.type !== "checkbox") {
        alert(field.label + " is required");
        return;
      }

      values[field.id] = el.type === "checkbox" ? el.checked : el.value;
      visibleFields.push(field.id);
    }
  });

  fetch("/api/submit", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      formVersion: formConfig.formVersion,
      values: values,
      visibleFieldIds: visibleFields
    })
  })
  .then(res => res.json())
  .then(data => {
    const msg = document.getElementById("message");
    msg.innerText = data.message;
    msg.className = "success-message";
  });
}
