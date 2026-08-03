"use strict";

// Quantidade fixa de espaços do deck mostrados na home
const TAMANHO_DECK = 8;

// Mostra uma mensagem de status na tela inicial
function exibirMensagem(mensagem) {
    document.getElementById("mensagem-jogo").textContent = mensagem;
}

// Desenha os espaços vazios do deck na tela inicial
function renderizarDeck() {
    const listaDeck = document.getElementById("lista-deck");
    const estadoDeck = document.getElementById("estado-deck");

    try {
        const fragmento = document.createDocumentFragment();

        for (let indice = 1; indice <= TAMANHO_DECK; indice += 1) {
            // Cada item representa um espaço vazio fixo do deck inicial.
            const espacoCarta = document.createElement("li");

            espacoCarta.className = "espaco-carta";
            espacoCarta.setAttribute("aria-label", `Espaço ${indice} do deck vazio`);
            fragmento.append(espacoCarta);
        }

        listaDeck.append(fragmento);
        listaDeck.hidden = false;
        estadoDeck.classList.add("concluido");
        estadoDeck.textContent = "Seu deck possui 8 espaços disponíveis.";
    } catch {
        estadoDeck.textContent = "Não foi possível carregar seu deck. Atualize a página e tente novamente.";
    }
}

// Liga o botão de batalhar e os itens de navegação ainda não implementados
function configurarInteracoes() {
    document.getElementById("botao-batalhar").addEventListener("click", () => {
        window.location.assign("batalha.html");
    });

    document.querySelectorAll(".item-navegacao[data-secao]").forEach((botao) => {
        botao.addEventListener("click", () => {
            exibirMensagem(`A seção ${botao.dataset.secao} estará disponível em breve.`);
        });
    });
}

// Inicia a tela inicial quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    renderizarDeck();
    configurarInteracoes();
});
