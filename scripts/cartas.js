"use strict";

// Configurações fixas: tamanho máximo do deck e chave usada no localStorage
const LIMITE_DECK = 8;
const CHAVE_PACOTES_PENDENTES = "pacotes-pendentes";
// Lista de todas as cartas disponíveis na coleção
const cartas = [
    { id: "gumball", nome: "Gumball", hp: 90, dano: 20, imagem: "" },
    { id: "darwin", nome: "Darwin", hp: 76, dano: 18, imagem: "" },
    { id: "finn", nome: "Finn", hp: 84, dano: 22, imagem: "" },
    { id: "jake", nome: "Jake", hp: 72, dano: 16, imagem: "" },
    { id: "mordecai", nome: "Mordecai", hp: 80, dano: 19, imagem: "" },
    { id: "rigby", nome: "Rigby", hp: 68, dano: 17, imagem: "" },
    { id: "ben", nome: "Ben 10", hp: 86, dano: 21, imagem: "" },
    { id: "dexter", nome: "Dexter", hp: 70, dano: 23, imagem: "" },
    { id: "billy", nome: "Billy", hp: 74, dano: 18, imagem: "" },
    { id: "mandy", nome: "Mandy", hp: 78, dano: 20, imagem: "" },
    { id: "blossom", nome: "Florzinha", hp: 82, dano: 22, imagem: "" },
    { id: "bubbles", nome: "Lindinha", hp: 76, dano: 19, imagem: "" },
    { id: "buttercup", nome: "Docinho", hp: 84, dano: 24, imagem: "" },
    { id: "courage", nome: "Coragem", hp: 68, dano: 21, imagem: "" },
    { id: "samurai-jack", nome: "Samurai Jack", hp: 88, dano: 25, imagem: "" },
    { id: "aku", nome: "Aku", hp: 88, dano: 20, imagem: "" },
    { id: "vilgax", nome: "Vilgax", hp: 78, dano: 19, imagem: "" },
    { id: "mandark", nome: "Mandark", hp: 70, dano: 18, imagem: "" }
];

// Deck atual do jogador (ids das cartas) e quantidade de pacotes ainda não abertos
const deck = [];
let pacotesPendentes = 0;

// Lê do localStorage quantos pacotes o jogador ainda tem para abrir
function obterPacotesPendentes() {
    try {
        const quantidade = Number.parseInt(localStorage.getItem(CHAVE_PACOTES_PENDENTES) ?? "0", 10);

        return Number.isInteger(quantidade) && quantidade > 0 ? quantidade : 0;
    } catch {
        return 0;
    }
}

// Salva no localStorage a quantidade atual de pacotes pendentes
function salvarPacotesPendentes() {
    try {
        localStorage.setItem(CHAVE_PACOTES_PENDENTES, String(pacotesPendentes));
        return true;
    } catch {
        exibirMensagem("O pacote foi aberto, mas não foi possível salvar seu inventário.");
        return false;
    }
}

// Mostra, esconde e atualiza o texto do botão de abrir pacotes
function renderizarBotaoPacotes() {
    const botao = document.getElementById("botao-abrir-pacote");
    const possuiPacotes = pacotesPendentes > 0;
    const texto = pacotesPendentes === 1 ? "Abrir pacote" : `Abrir pacotes (${pacotesPendentes})`;

    botao.hidden = !possuiPacotes;
    botao.disabled = !possuiPacotes;
    botao.querySelector("span").textContent = texto;
    botao.setAttribute("aria-label", possuiPacotes
        ? `${texto}. Você possui ${pacotesPendentes} ${pacotesPendentes === 1 ? "pacote disponível" : "pacotes disponíveis"}.`
        : "Você não possui pacotes para abrir.");
}

// Sorteia 3 cartas aleatórias e diferentes para um pacote
function sortearCartasPacote() {
    const cartasDisponiveis = [...cartas];
    const cartasRecebidas = [];

    while (cartasRecebidas.length < 3 && cartasDisponiveis.length) {
        const indiceSorteado = Math.floor(Math.random() * cartasDisponiveis.length);

        // Remove a carta sorteada do pool para evitar repetição no mesmo pacote.
        cartasRecebidas.push(cartasDisponiveis.splice(indiceSorteado, 1)[0]);
    }

    return cartasRecebidas;
}

// Abre um pacote pendente, sorteia as cartas recebidas e mostra o resultado
function abrirPacote() {
    if (!pacotesPendentes) {
        return;
    }

    pacotesPendentes -= 1;
    salvarPacotesPendentes();
    renderizarBotaoPacotes();

    const cartasRecebidas = sortearCartasPacote();
    const nomesCartas = cartasRecebidas.map((carta) => carta.nome).join(", ");

    exibirMensagem(`Pacote aberto. Você recebeu: ${nomesCartas}.`);
}

// Busca uma carta da coleção pelo seu id
function obterCarta(idCarta) {
    return cartas.find((carta) => carta.id === idCarta);
}

// Cria a área de imagem da carta (ou um aviso de indisponível, se não houver imagem)
function criarImagemCarta(carta) {
    const imagem = document.createElement("div");

    imagem.className = "imagem-carta";

    if (carta.imagem) {
        const elementoImagem = document.createElement("img");

        elementoImagem.src = carta.imagem;
        elementoImagem.alt = `Ilustração de ${carta.nome}`;
        elementoImagem.loading = "lazy";
        imagem.append(elementoImagem);
    } else {
        imagem.setAttribute("aria-label", `Área de ilustração de ${carta.nome} ainda indisponível`);
    }

    return imagem;
}

// Cria o bloco de texto com nome, HP e dano da carta
function criarDadosCarta(carta) {
    const dados = document.createElement("span");
    const nome = document.createElement("strong");
    const hp = document.createElement("span");
    const dano = document.createElement("span");

    dados.className = "dados-carta-colecao";
    nome.textContent = carta.nome;
    hp.textContent = `HP ${carta.hp}`;
    dano.textContent = `DMG ${carta.dano}`;
    dados.append(nome, hp, dano);

    return dados;
}

// Desenha os 8 espaços do deck, vazios ou preenchidos com a carta escolhida
function renderizarDeck() {
    const gradeDeck = document.getElementById("grade-deck");
    const estadoDeck = document.getElementById("estado-deck");
    const fragmento = document.createDocumentFragment();

    for (let indice = 0; indice < LIMITE_DECK; indice += 1) {
        // O deck sempre renderiza 8 slots, preenchidos ou vazios.
        const espaco = document.createElement("li");
        const idCarta = deck[indice];

        espaco.className = "slot-deck";

        if (!idCarta) {
            espaco.classList.add("vazio");
            espaco.setAttribute("aria-label", `Espaço ${indice + 1} do deck vazio`);
            fragmento.append(espaco);
            continue;
        }

        const carta = obterCarta(idCarta);
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "carta-deck";
        botao.dataset.idCarta = carta.id;
        botao.setAttribute("aria-label", `Remover ${carta.nome} do seu deck. HP ${carta.hp}, dano ${carta.dano}.`);
        botao.append(criarImagemCarta(carta), criarDadosCarta(carta));
        espaco.append(botao);
        fragmento.append(espaco);
    }

    gradeDeck.replaceChildren(fragmento);
    estadoDeck.textContent = deck.length
        ? `${deck.length} de ${LIMITE_DECK} cartas selecionadas no deck.`
        : "Seu deck está vazio. Selecione cartas na coleção para adicioná-las.";
}

// Desenha todas as cartas da coleção, desabilitando as que já estão no deck
function renderizarColecao() {
    const gradeColecao = document.getElementById("grade-colecao");
    const estadoColecao = document.getElementById("estado-colecao");
    const fragmento = document.createDocumentFragment();

    if (!cartas.length) {
        estadoColecao.textContent = "Nenhuma carta está disponível no momento.";
        gradeColecao.replaceChildren();
        return;
    }

    cartas.forEach((carta) => {
        const item = document.createElement("li");
        const botao = document.createElement("button");
        const cartaNoDeck = deck.includes(carta.id);

        botao.type = "button";
        botao.className = "carta-colecao";
        botao.dataset.idCarta = carta.id;
        // Bloqueia adição quando a carta já está no deck ou o limite foi atingido.
        botao.disabled = cartaNoDeck || deck.length >= LIMITE_DECK;
        botao.setAttribute("aria-label", cartaNoDeck
            ? `${carta.nome} já está no seu deck. HP ${carta.hp}, dano ${carta.dano}.`
            : `Adicionar ${carta.nome} ao deck. HP ${carta.hp}, dano ${carta.dano}.`);
        botao.append(criarImagemCarta(carta), criarDadosCarta(carta));
        item.append(botao);
        fragmento.append(item);
    });

    gradeColecao.replaceChildren(fragmento);
    estadoColecao.textContent = `${cartas.length} cartas disponíveis na coleção.`;
}

// Mostra uma mensagem de status da tela de coleção
function exibirMensagem(mensagem) {
    document.getElementById("mensagem-colecao").textContent = mensagem;
}

// Adiciona uma carta ao deck, se ela ainda não estiver nele e houver espaço
function adicionarCarta(idCarta) {
    const carta = obterCarta(idCarta);

    if (!carta || deck.includes(idCarta)) {
        return;
    }

    if (deck.length >= LIMITE_DECK) {
        exibirMensagem("Seu deck já possui o máximo de 8 cartas.");
        return;
    }

    deck.push(idCarta);
    renderizarDeck();
    renderizarColecao();
    // Devolve o foco para a carta no deck para feedback imediato de teclado.
    document.querySelector(`#grade-deck .carta-deck[data-id-carta="${idCarta}"]`)?.focus();
    exibirMensagem(`${carta.nome} foi adicionado ao seu deck.`);
}

// Remove uma carta do deck do jogador
function removerCarta(idCarta) {
    const indiceCarta = deck.indexOf(idCarta);
    const carta = obterCarta(idCarta);

    if (indiceCarta === -1 || !carta) {
        return;
    }

    deck.splice(indiceCarta, 1);
    renderizarDeck();
    renderizarColecao();
    // Após remover, volta o foco para a carta na coleção para facilitar nova escolha.
    document.querySelector(`#grade-colecao .carta-colecao[data-id-carta="${idCarta}"]`)?.focus();
    exibirMensagem(`${carta.nome} foi removido do seu deck.`);
}

// Liga os cliques da coleção, do deck e do botão de abrir pacote às suas ações
function configurarInteracoes() {
    document.getElementById("grade-colecao").addEventListener("click", (evento) => {
        const botao = evento.target.closest(".carta-colecao");

        if (botao && !botao.disabled) {
            adicionarCarta(botao.dataset.idCarta);
        }
    });

    document.getElementById("grade-deck").addEventListener("click", (evento) => {
        const botao = evento.target.closest(".carta-deck");

        if (botao) {
            removerCarta(botao.dataset.idCarta);
        }
    });

    document.getElementById("botao-abrir-pacote").addEventListener("click", abrirPacote);
}

// Carrega o estado inicial da tela de cartas (deck, coleção e pacotes)
function iniciarColecao() {
    try {
        // Carrega primeiro os pacotes pendentes para exibir o botão corretamente.
        pacotesPendentes = obterPacotesPendentes();
        renderizarDeck();
        renderizarColecao();
        renderizarBotaoPacotes();
        configurarInteracoes();
    } catch {
        document.getElementById("estado-colecao").textContent = "Não foi possível carregar as cartas. Atualize a página e tente novamente.";
    }
}

// Inicia a tela de cartas quando a página carrega
document.addEventListener("DOMContentLoaded", iniciarColecao);
