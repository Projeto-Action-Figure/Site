"use strict";

const TAMANHO_DECK = 8;

function exibirMensagem(mensagem) {
    document.getElementById("mensagem-jogo").textContent = mensagem;
}

function renderizarDeck() {
    const listaDeck = document.getElementById("lista-deck");
    const estadoDeck = document.getElementById("estado-deck");

    try {
        const fragmento = document.createDocumentFragment();

        for (let indice = 1; indice <= TAMANHO_DECK; indice += 1) {
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

function configurarInteracoes() {
    document.getElementById("botao-batalhar").addEventListener("click", () => {
        exibirMensagem("As batalhas estarão disponíveis em breve.");
    });

    document.querySelectorAll(".item-navegacao").forEach((botao) => {
        botao.addEventListener("click", () => {
            document.querySelectorAll(".item-navegacao").forEach((item) => {
                item.classList.toggle("ativo", item === botao);
                item.setAttribute("aria-pressed", String(item === botao));
            });

            exibirMensagem(`A seção ${botao.dataset.secao} estará disponível em breve.`);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarDeck();
    configurarInteracoes();
});
