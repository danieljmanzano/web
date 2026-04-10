const URL_API = 'https://api.jsonbin.io/v3/b/69d64173aaba882197d7779a';

let bebidas           = [];
let bebidaSelecionada = null;
let centavosInseridos = 0;
let moedaArrastada    = 0;

// carrega bebidas do json
fetch(URL_API)
  .then(res => res.json())
  .then(data => {
    bebidas = data.record.bebidas;
    renderizarProdutos();
  })
  .catch(() => {
    document.getElementById('lista-produtos').innerHTML =
      '<p class="msg-carregando" style="color:#f66">Erro ao carregar.</p>';
  });

function renderizarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';
  bebidas.forEach((bebida, indice) => {
    const btn = document.createElement('button');
    btn.className = 'btn-produto';
    btn.dataset.indice = indice;
    btn.innerHTML = `
      <img class="img-bebida" src="${bebida.imagem}" alt="${bebida.sabor}" onerror="this.style.display='none'" />
      <span class="info-bebida">
        <span class="nome-bebida">${bebida.sabor}</span>
        <span class="preco-bebida">R$ ${bebida.preco.toFixed(2).replace('.', ',')}</span>
      </span>
    `;
    btn.addEventListener('click', () => selecionarBebida(indice));
    lista.appendChild(btn);
  });
}

function selecionarBebida(indice) {
  bebidaSelecionada = bebidas[indice];
  document.querySelectorAll('.btn-produto').forEach(b => b.classList.remove('ativo'));
  document.querySelector(`.btn-produto[data-indice="${indice}"]`).classList.add('ativo');
  limparMensagem();
}

// drag & drop das moedas
function aoArrastarMoeda(evento, valorCentavos) {
  moedaArrastada = valorCentavos;
  evento.dataTransfer.effectAllowed = 'copy';
  evento.target.classList.add('arrastando');
}

// prevenção de bugs se a moeda for solta fora do local correto
function aoTerminarArraste(evento) {
  moedaArrastada = 0; 
  evento.target.classList.remove('arrastando'); 
}

function aoSoltarMoeda(evento) {
  evento.preventDefault();
  if (!moedaArrastada) return;
  centavosInseridos += moedaArrastada;
  atualizarVisor();
  moedaArrastada = 0;
}

const entrada = document.getElementById('entrada-moeda');
entrada.addEventListener('dragenter', () => entrada.classList.add('arrastando-sobre'));
entrada.addEventListener('dragleave', () => entrada.classList.remove('arrastando-sobre'));
entrada.addEventListener('drop',      () => entrada.classList.remove('arrastando-sobre'));

function atualizarVisor() {
  const reais = centavosInseridos / 100;
  document.getElementById('valor-visor').textContent =
    'R$' + reais.toFixed(2).replace('.', ',');
}

function comprarBebida() {
  if (!bebidaSelecionada) {
    mostrarAviso('Selecione uma bebida.');
    return;
  }

  const precoCentavos = Math.round(bebidaSelecionada.preco * 100);

  if (centavosInseridos < precoCentavos) {
    const faltam = (precoCentavos - centavosInseridos) / 100;
    mostrarAviso(`Saldo insuficiente.\nFaltam R$${faltam.toFixed(2).replace('.', ',')}.`);
    return;
  }

  const trocoCentavos = centavosInseridos - precoCentavos;
  if (trocoCentavos > 0) {
    const troco = trocoCentavos / 100;
    mostrarMensagem(
      `Refrigerante "${bebidaSelecionada.sabor}" liberado!\nTroco: R$${troco.toFixed(2).replace('.', ',')}.`,
      'troco'
    );
  } else { // mensagem sem troco
    mostrarMensagem(`Refrigerante "${bebidaSelecionada.sabor}" liberado!`, 'ok');
  }

  // reset
  centavosInseridos = 0;
  bebidaSelecionada = null;
  document.querySelectorAll('.btn-produto').forEach(b => b.classList.remove('ativo'));
  atualizarVisor();
}

// mensagens
function mostrarMensagem(texto, tipo) {
  const caixa = document.getElementById('caixa-mensagem');
  caixa.textContent = texto;
  caixa.className = 'sobreposicao caixa-mensagem ' + (tipo || '');

  setTimeout(limparMensagem, 5000); // oculta a mensagem automaticamente após 5 segundos
}

function limparMensagem() {
  const caixa = document.getElementById('caixa-mensagem');
  caixa.textContent = '';
  caixa.className = 'sobreposicao caixa-mensagem';
}

// avisos de erro
function mostrarAviso(texto) {
  const visor = document.getElementById('visor-avisos');
  visor.textContent = texto;
  visor.classList.add('ativo');
  
  setTimeout(limparAviso, 3000); // oculta o aviso automaticamente após 3 segundos
}

function limparAviso() {
  const visor = document.getElementById('visor-avisos');
  visor.textContent = '';
  visor.classList.remove('ativo');
}