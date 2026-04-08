const API_URL = 'https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a';

let drinks        = [];
let selectedDrink = null;
let insertedCents = 0;
let draggedCoin   = 0;

// carrega bebidas do json
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    drinks = data.record.bebidas;
    renderProducts();
  })
  .catch(() => {
    document.getElementById('products-list').innerHTML =
      '<p class="loading-msg" style="color:#f66">Erro ao carregar.</p>';
  });

function renderProducts() {
  const list = document.getElementById('products-list');
  list.innerHTML = '';
  drinks.forEach((drink, i) => {
    const btn = document.createElement('button');
    btn.className = 'product-btn';
    btn.dataset.index = i;
    btn.innerHTML = `
      <img class="drink-img" src="${drink.imagem}" alt="${drink.sabor}" onerror="this.style.display='none'" />
      <span class="drink-info">
        <span class="drink-name">${drink.sabor}</span>
        <span class="drink-price">R$ ${drink.preco.toFixed(2).replace('.', ',')}</span>
      </span>
    `;
    btn.addEventListener('click', () => selectDrink(i));
    list.appendChild(btn);
  });
}

// seleção de bebida
function selectDrink(index) {
  selectedDrink = drinks[index];
  document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.product-btn[data-index="${index}"]`).classList.add('active');
  document.getElementById('selected-label').textContent =
    `${selectedDrink.sabor} R$${selectedDrink.preco.toFixed(2).replace('.', ',')}`;
  clearMessage();
}

// drag & drop das moedas
function onCoinDrag(event, valueCents) {
  draggedCoin = valueCents;
  event.dataTransfer.effectAllowed = 'copy';
}

function onCoinDrop(event) {
  event.preventDefault();
  if (!draggedCoin) return;
  insertedCents += draggedCoin;
  updateDisplay();
  draggedCoin = 0;
}

const slot = document.getElementById('coin-slot');
slot.addEventListener('dragenter', () => slot.classList.add('drag-over'));
slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
slot.addEventListener('drop',      () => slot.classList.remove('drag-over'));

// atualiza visor
function updateDisplay() {
  const reais = insertedCents / 100;
  document.getElementById('display-value').textContent =
    'R$' + reais.toFixed(2).replace('.', ',');
}

// comprar
function buyDrink() {
  if (!selectedDrink) {
    showMessage('Selecione uma bebida primeiro.', 'erro');
    return;
  }

  const priceCents = Math.round(selectedDrink.preco * 100);

  if (insertedCents < priceCents) {
    const faltam = (priceCents - insertedCents) / 100;
    showMessage(`Saldo insuficiente.\nFaltam R$ ${faltam.toFixed(2).replace('.', ',')}.`, 'erro');
    return;
  }

  const trocoCents = insertedCents - priceCents;
  if (trocoCents > 0) {
    const troco = trocoCents / 100;
    showMessage(
      `Refrigerante "${selectedDrink.sabor}" liberado!\nTroco: R$ ${troco.toFixed(2).replace('.', ',')}.`,
      'troco'
    );
  } else {
    showMessage(`Refrigerante "${selectedDrink.sabor}" liberado!`, 'ok');
  }

  // reset
  insertedCents = 0;
  selectedDrink = null;
  document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('selected-label').textContent = 'Nenhum selecionado';
  updateDisplay();
}

// mensagens
function showMessage(text, type) {
  const box = document.getElementById('message-box');
  box.textContent = text;
  box.className = 'message-box ' + (type || '');
}

function clearMessage() {
  const box = document.getElementById('message-box');
  box.textContent = '';
  box.className = 'message-box';
}
