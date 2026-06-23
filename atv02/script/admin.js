// ----------------------------------------------------------------------------
// Poções e Soluções — Script Admin
// CRUD de poções via AJAX (fetch)
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initForm();
  loadAdminPotions();
});

// Estado ---------------------------------------------------------------------

let pendingDeleteId = null;

// Inicializar formulário -----------------------------------------------------

function initForm() {
  const form = document.getElementById("potion-form");
  form.addEventListener("submit", handleSubmit);

  // Modal de confirmação
  document.getElementById("btn-cancel-delete").addEventListener("click", closeModal);
  document.getElementById("btn-confirm-delete").addEventListener("click", confirmDelete);

  // Fechar modal ao clicar fora
  document.getElementById("confirm-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

// Cadastrar poção ------------------------------------------------------------

async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const feedback = document.getElementById("form-feedback");
  const submitBtn = document.getElementById("btn-submit");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  // Coletar dados
  const data = {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    image: form.image.value.trim(),
    price: parseInt(form.price.value, 10),
  };

  // Validação simples
  if (!data.name || !data.description || !data.image || isNaN(data.price) || data.price <= 0) {
    showFeedback(feedback, "Preencha todos os campos corretamente.", "error");
    return;
  }

  // Loading
  submitBtn.disabled = true;
  btnText.style.display = "none";
  btnLoading.style.display = "inline";

  try {
    const response = await fetch("/api/potions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erro desconhecido");
    }

    const potion = await response.json();
    showFeedback(feedback, `"${potion.name}" cadastrada com sucesso!`, "success");

    // Limpar formulário
    form.reset();

    // Recarregar lista
    loadAdminPotions();
  } catch (error) {
    console.error("Erro ao cadastrar poção:", error);
    showFeedback(feedback, `Erro: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = "inline";
    btnLoading.style.display = "none";
  }
}

// Listar poções --------------------------------------------------------------

async function loadAdminPotions() {
  const list = document.getElementById("admin-potions-list");

  try {
    const response = await fetch("/api/potions");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const potions = await response.json();

    if (potions.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <p>Nenhuma poção cadastrada.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = "";

    potions.forEach((potion, index) => {
      const item = createAdminItem(potion);
      list.appendChild(item);
    });
  } catch (error) {
    console.error("Erro ao carregar poções:", error);
    list.innerHTML = `
      <div class="empty-state">
        <p>Erro ao carregar poções. Verifique o servidor.</p>
      </div>
    `;
  }
}

// Criar item da lista admin --------------------------------------------------

function createAdminItem(potion) {
  const item = document.createElement("div");
  item.className = "admin-potion-item";

  item.innerHTML = `
    <img
      src="${potion.image}"
      alt="${escapeHtml(potion.name)}"
      class="admin-potion-thumb"
      onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect fill=%22%231a1628%22 width=%2264%22 height=%2264%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b5f87%22 font-size=%2220%22>🧪</text></svg>'"
    />
    <div class="admin-potion-info">
      <div class="admin-potion-name">${escapeHtml(potion.name)}</div>
      <div class="admin-potion-meta">${escapeHtml(truncate(potion.description, 60))}</div>
    </div>
    <span class="admin-potion-price">${potion.price} moedas</span>
    <button class="btn-delete" onclick="requestDelete(${potion.id}, '${escapeHtml(potion.name)}')">
      Remover
    </button>
  `;

  return item;
}

// Remover poção (modal) ------------------------------------------------------

function requestDelete(id, name) {
  pendingDeleteId = id;
  document.getElementById("modal-text").textContent =
    `Tem certeza que deseja remover a poção "${name}"? Esta ação não pode ser desfeita.`;
  document.getElementById("confirm-modal").style.display = "flex";
}

async function confirmDelete() {
  if (!pendingDeleteId) return;

  try {
    const response = await fetch(`/api/potions/${pendingDeleteId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao remover");

    closeModal();
    loadAdminPotions();
  } catch (error) {
    console.error("Erro ao remover poção:", error);
    alert("Erro ao remover a poção. Tente novamente.");
    closeModal();
  }
}

function closeModal() {
  document.getElementById("confirm-modal").style.display = "none";
  pendingDeleteId = null;
}

// Utilitários ----------------------------------------------------------------

function showFeedback(el, message, type) {
  el.textContent = message;
  el.className = `form-feedback ${type}`;

  if (type === "success") {
    setTimeout(() => {
      el.textContent = "";
      el.className = "form-feedback";
    }, 4000);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen) + "…";
}
