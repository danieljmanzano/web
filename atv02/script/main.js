// ----------------------------------------------------------------------------
// Poções e Soluções — Script Principal (Loja)
// Carrega poções via AJAX e gerencia interações do comprador
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  loadPotions();
});

// Navegação mobile -----------------------------------------------------------

function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });

    // Fecha o menu ao clicar em um link
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
      });
    });
  }
}

// Carregar poções do Web Service ---------------------------------------------

async function loadPotions() {
  const grid = document.getElementById("products-grid");

  try {
    const response = await fetch("/api/potions");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const potions = await response.json();

    if (potions.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>Nenhuma poção disponível no momento.</p>
          <p>Volte em breve para ver nossas novidades!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = "";

    potions.forEach((potion, index) => {
      const card = createPotionCard(potion);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar poções:", error);
    grid.innerHTML = `
      <div class="empty-state">
        <p>Erro ao carregar as poções.</p>
        <p>Verifique se o servidor está rodando.</p>
      </div>
    `;
  }
}

// Criar card de poção -------------------------------------------------------

function createPotionCard(potion) {
  const card = document.createElement("div");
  card.className = "potion-card";

  card.innerHTML = `
    <div class="potion-card-image-wrap">
      <img
        src="${potion.image}"
        alt="${escapeHtml(potion.name)}"
        class="potion-card-image"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%231a1628%22 width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b5f87%22 font-size=%2240%22>🧪</text></svg>'"
      />
      <div class="potion-card-price-badge">${potion.price} moedas</div>
    </div>
    <div class="potion-card-body">
      <h3 class="potion-card-name">${escapeHtml(potion.name)}</h3>
      <p class="potion-card-desc">${escapeHtml(potion.description)}</p>
      <div class="potion-card-footer">
        <span class="potion-card-price">${potion.price} moedas</span>
        <button class="btn-buy" onclick="buyPotion('${escapeHtml(potion.name)}')">
          Comprar
        </button>
      </div>
    </div>
  `;

  return card;
}

// Comprar poção (placeholder) ------------------------------------------------

function buyPotion(name) {
  alert(`"${name}" adicionada ao caldeirão!\n\n(Funcionalidade de compra em breve)`);
}

// Utilitário: escapar HTML --------------------------------------------------- 

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
