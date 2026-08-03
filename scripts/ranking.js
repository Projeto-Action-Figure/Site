"use strict";

// Lista de jogadores e pontos do ranking regional
const rankingRegional = [
    { nome: "LunaCartoon", pontos: 2480 },
    { nome: "PandaMestre", pontos: 2415 },
    { nome: "Rex_10", pontos: 2360 },
    { nome: "MordecaiBR", pontos: 2295 },
    { nome: "Florzinha", pontos: 2240 },
    { nome: "BmoPlayer", pontos: 2175 },
    { nome: "Cerebro_3000", pontos: 2130 },
    { nome: "Jake_Arco", pontos: 2085 },
    { nome: "RavenaCN", pontos: 2020 },
    { nome: "Mandy_01", pontos: 1970 }
];

// Lista de jogadores e pontos do ranking global
const rankingGlobal = [
    { nome: "NovaHero", pontos: 3280 },
    { nome: "CardMaster", pontos: 3195 },
    { nome: "GumballFan", pontos: 3070 },
    { nome: "Trix_77", pontos: 2980 },
    { nome: "SamuraiDeck", pontos: 2890 },
    { nome: "DinoWarrior", pontos: 2755 },
    { nome: "Ben_10X", pontos: 2640 },
    { nome: "DexterLab", pontos: 2580 },
    { nome: "FinnQuest", pontos: 2490 },
    { nome: "AdventureTime", pontos: 2400 }
];

// Cria o item de uma posição do ranking (número, nome e pontos)
function criarPosicao(jogador, posicao) {
    const item = document.createElement("li");
    const numero = document.createElement("span");
    const nome = document.createElement("strong");
    const pontos = document.createElement("span");

    item.className = "posicao-ranking";
    numero.className = "numero-ranking";
    nome.className = "nome-ranking";
    pontos.className = "pontos-ranking";
    numero.textContent = String(posicao);
    nome.textContent = jogador.nome;
    pontos.textContent = `${jogador.pontos} pts`;
    item.setAttribute("aria-label", `Posição ${posicao}: ${jogador.nome}, ${jogador.pontos} pontos.`);
    item.append(numero, nome, pontos);

    return item;
}

// Desenha a lista de jogadores de um ranking na tela
function renderizarRanking(idLista, jogadores) {
    const lista = document.getElementById(idLista);

    if (!jogadores.length) {
        lista.replaceChildren();
        return false;
    }

    const fragmento = document.createDocumentFragment();

    jogadores.forEach((jogador, indice) => {
        fragmento.append(criarPosicao(jogador, indice + 1));
    });

    lista.replaceChildren(fragmento);
    return true;
}

// Carrega e desenha os rankings regional e global quando a página abre
function iniciarRanking() {
    const estado = document.getElementById("estado-ranking");

    try {
        // Renderiza as duas listas e decide a mensagem de estado com base no que foi carregado.
        const possuiRegional = renderizarRanking("ranking-regional", rankingRegional);
        const possuiGlobal = renderizarRanking("ranking-global", rankingGlobal);

        estado.textContent = possuiRegional || possuiGlobal
            ? "Ranking da temporada carregado."
            : "Ainda não há jogadores classificados nesta temporada.";
        estado.classList.add("concluido");
    } catch {
        estado.textContent = "Não foi possível carregar o ranking. Atualize a página e tente novamente.";
    }
}

// Inicia o ranking quando a página carrega
document.addEventListener("DOMContentLoaded", iniciarRanking);