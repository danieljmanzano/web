// ------------------------------
// declaração de funções sem chamar "function" de fato (usando arrow function)
const divide = (a, b) => {
    if (b === 0) {
        return "não é possível dividir por zero";
    }
    return a / b;
}
console.log(divide(10, 2));
console.log(divide(10, 0));

// duas funções que fazem o mesmo
function olaMundo() { return "olá mundo"; }
const olaMundo2 = () => "olá mundo";
console.log(olaMundo());
console.log(olaMundo2());

// mais exemplo de uso
let nums = [23, 42, 18, 2, 9, 29, 3]
nums.sort((a, b) => a - b); // ordena os números em ordem crescente
console.log(nums);

// ------------------------------
// quando um html chama muitos .js e existem várias funções com mesmo nome, pode ocorrer colisão
// assim, é possível usar funções anônimas para evitar isso
(function() {
    function mensagem() {
        return "essa mensagem foi escrita numa função anônima";
    }
    console.log(mensagem());
})(); // essa é uma função que funciona localmente e pontualmente, sem afetar o escopo global

// estrutura:
(function() {
    // variáveis e funções locais que não possuem escopo global
}) () // os parênteses no final fazem a função ser executada imediatamente, sem precisar ser chamada por outro código
      // sem eles, a função seria apenas declarada e não executada (sem efeito nenhum)

// ------------------------------
// adição de texto no html
const paragrafo_novo = document.createElement("p"); // cria um elemento <p> (parágrafo)
paragrafo_novo.innerText = "esse parágrafo foi criado usando js"; // define o texto do parágrafo
document.getElementById("mensagem-js").appendChild(paragrafo_novo); // adiciona o parágrafo criado como filho do elemento com id "mensagem-js"

const paragrafo_novo2 = document.createElement("p");
paragrafo_novo2.innerText = "esse parágrafo também foi criado usando js";
document.getElementById("mensagem2-js").appendChild(paragrafo_novo2); // adiciona a outro id

// retirar parágrafo do html com base em interação do usuário
const botao = document.getElementById("botao-remover");
botao.addEventListener("click", function() { // adiciona um evento de clique ao botão
    const paragrafo = document.getElementById("paragrafo-remover"); // seleciona o parágrafo a ser removido
    if (paragrafo) { // verifica se o parágrafo existe
        paragrafo.remove(); // remove o parágrafo do html
    }
});
