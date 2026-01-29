function $(id) {
  return document.getElementById(id);
}

/* ========== Message Helper ========== */
function setAdminMessage(text, kind) {
  const el = $("adminMessage");
  el.innerText = text || "";
  el.className =
    kind === "success"
      ? "success-message"
      : kind === "error"
      ? "error-message"
      : "";
}

/* ========== Render Submissions List ========== */
function renderList(items) {
  const list = $("submissionsList");
  list.innerHTML = "";

  if (!items || items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "list-empty";
    empty.innerText = "No submissions found.";
    list.appendChild(empty);
    return;
  }

  items.forEach((s) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "list-item";

    const title = document.createElement("div");
    title.className = "list-title";
    title.innerText = s.submissionId || "(no id)";

    const meta = document.createElement("div");
    meta.className = "list-meta";
    const version =
      typeof s.formVersion !== "undefined" ? `v${s.formVersion}` : "v?";
    meta.innerText = `${version} • ${s.timestamp || ""}`;

    row.appendChild(title);
    row.appendChild(meta);

    row.addEventListener("click", () => {
      loadDetail(s.submissionId);
    });

    list.appendChild(row);
  });
}

/* ========== Load Submissions List ========== */
async function loadList() {
  setAdminMessage("", "");

  const q = ($("searchQuery").value || "").trim();
  const fieldId = ($("searchFieldId").value || "").trim();

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (fieldId) params.set("fieldId", fieldId);

  try {
    const res = await fetch(`/api/submissions?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      setAdminMessage("Failed to load submissions", "error");
      return;
    }

    renderList(Array.isArray(data) ? data : []);
    $("submissionDetail").innerText = "";
  } catch (err) {
    setAdminMessage("Server error while loading submissions", "error");
  }
}

/* ========== Load Submission Detail ========== */
async function loadDetail(submissionId) {
  if (!submissionId) return;

  try {
    const res = await fetch(
      `/api/submissions/${encodeURIComponent(submissionId)}`
    );
    const data = await res.json();

    if (!res.ok) {
      setAdminMessage("Failed to load submission detail", "error");
      return;
    }

    $("submissionDetail").innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    setAdminMessage("Server error while loading detail", "error");
  }
}

/* ========== Init ========== */
function initAdmin() {
  $("refreshBtn").addEventListener("click", loadList);

  $("searchQuery").addEventListener("input", () => {
    clearTimeout(window.__adminSearchTimer);
    window.__adminSearchTimer = setTimeout(loadList, 300);
  });

  $("searchFieldId").addEventListener("change", loadList);

  loadList();
}

initAdmin();
