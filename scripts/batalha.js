"use strict";

const ENERGIA_MAXIMA = 3;
const TEMPO_INICIAL = 25;
const ATRASO_SAIDA_BATALHA = 1200;
const TAMANHO_CAMPO = 3;

const estado = {
    jogador: {
        vida: 4,
        energia: ENERGIA_MAXIMA,
        cartas: [
            { nome: "Gumball", vida: 90, vidaMaxima: 90, dano: 20 },
            { nome: "Darwin", vida: 76, vidaMaxima: 76, dano: 18 },
            { nome: "Finn", vida: 84, vidaMaxima: 84, dano: 22 },
            { nome: "Jake", vida: 72, vidaMaxima: 72, dano: 16 },
            { nome: "Mordecai", vida: 80, vidaMaxima: 80, dano: 19 }
        ]
    },
    adversario: {
        vida: 4,
        cartas: [
            { nome: "Aku", vida: 88, vidaMaxima: 88, dano: 20 },
            { nome: "Vilgax", vida: 78, vidaMaxima: 78, dano: 19 },
            { nome: "Mandark", vida: 70, vidaMaxima: 70, dano: 18 }
        ]
    },
    cartaSelecionada: null,
    indiceCartaCampo: 0,
    indiceCartaRival: 0,
    indiceAlvoRival: 0,
    segundosRestantes: TEMPO_INICIAL,
    turnoDoJogador: true,
    partidaEncerrada: false
};

let intervaloCronometro;

function obterCartaEmCampo(lado, indiceCarta) {
    return lado.cartas[indiceCarta];
}

function criarAreaImagemCarta() {
    const imagem = document.createElement("span");

    imagem.className = "area-imagem-carta";
    imagem.setAttribute("aria-hidden", "true");

    return imagem;
}

function criarDadosCarta(carta) {
    const dados = document.createElement("span");
    const nome = document.createElement("strong");
    const vida = document.createElement("span");
    const dano = document.createElement("span");

    dados.className = "dados-carta";
    nome.textContent = carta.nome;
    vida.textContent = `HP ${Math.max(0, carta.vida)}`;
    dano.textContent = `DMG ${carta.dano}`;
    dados.append(nome, vida, dano);

    return dados;
}

function criarCartaCampo(carta, posicao, indiceCarta, tipoCampo) {
    const item = document.createElement("li");
    const ehCartaJogador = tipoCampo === "jogador";
    const ehCartaRival = tipoCampo === "adversario";

    item.className = `carta-campo ativa ${posicao}`;

    if (ehCartaJogador || ehCartaRival) {
        const botao = document.createElement("button");
        const estaSelecionada = ehCartaJogador
            ? estado.indiceCartaCampo === indiceCarta
            : estado.indiceAlvoRival === indiceCarta;

        botao.type = "button";
        botao.className = "botao-carta-campo";
        botao.dataset.indiceCarta = String(indiceCarta);
        botao.setAttribute("aria-pressed", String(estaSelecionada));
        botao.setAttribute("aria-label", ehCartaJogador
            ? `Selecionar ${carta.nome}, HP ${Math.max(0, carta.vida)} de ${carta.vidaMaxima}, dano ${carta.dano}, para atacar ou trocar`
            : `Selecionar ${carta.nome}, HP ${Math.max(0, carta.vida)} de ${carta.vidaMaxima}, dano ${carta.dano}, como alvo do ataque`);
        botao.disabled = !estado.turnoDoJogador || estado.partidaEncerrada;
        botao.append(criarAreaImagemCarta(), criarDadosCarta(carta));
        item.classList.toggle("selecionada", estaSelecionada);
        item.classList.toggle("alvo", ehCartaRival);
        item.append(botao);
        return item;
    }

    item.setAttribute("aria-label", `${carta.nome}, HP ${Math.max(0, carta.vida)} de ${carta.vidaMaxima}, dano ${carta.dano}, carta ativa do adversário`);
    item.append(criarAreaImagemCarta(), criarDadosCarta(carta));

    return item;
}

function renderizarCampo(idLista, lado, tipoCampo) {
    const lista = document.getElementById(idLista);
    const fragmento = document.createDocumentFragment();
    const posicoes = ["esquerda", "centro", "direita"];

    lado.cartas.slice(0, TAMANHO_CAMPO).forEach((carta, indice) => {
        fragmento.append(criarCartaCampo(carta, posicoes[indice], indice, tipoCampo));
    });

    lista.replaceChildren(fragmento);
}

function renderizarMao() {
    const mao = document.getElementById("mao-jogador");
    const fragmento = document.createDocumentFragment();

    estado.jogador.cartas.slice(TAMANHO_CAMPO).forEach((carta, indice) => {
        const indiceCarta = indice + TAMANHO_CAMPO;
        const item = document.createElement("li");
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "carta-mao";
        botao.dataset.indiceCarta = String(indiceCarta);
        botao.setAttribute("aria-pressed", String(estado.cartaSelecionada === indiceCarta));
        botao.setAttribute("aria-label", `Selecionar ${carta.nome}, HP ${Math.max(0, carta.vida)} de ${carta.vidaMaxima}, dano ${carta.dano}, para troca`);
        botao.disabled = !estado.turnoDoJogador || estado.partidaEncerrada;
        botao.append(criarAreaImagemCarta(), criarDadosCarta(carta));
        item.append(botao);
        fragmento.append(item);
    });

    mao.replaceChildren(fragmento);
}

function atualizarCronometro() {
    document.getElementById("cronometro").textContent = `00:${String(estado.segundosRestantes).padStart(2, "0")}`;
}

function atualizarInterface(seletorFoco = "") {
    const cartaSelecionadaCampo = obterCartaEmCampo(estado.jogador, estado.indiceCartaCampo);
    const cartaAlvoRival = obterCartaEmCampo(estado.adversario, estado.indiceAlvoRival);
    const indicadorTurno = document.getElementById("indicador-turno");
    const textoTurno = indicadorTurno.querySelector("strong");
    const podeAtacar = estado.turnoDoJogador && !estado.partidaEncerrada && estado.jogador.energia >= 1;
    const podeTrocar = podeAtacar && estado.cartaSelecionada !== null;

    document.getElementById("vida-jogador").textContent = String(Math.max(0, estado.jogador.vida));
    document.getElementById("vida-adversario").textContent = String(Math.max(0, estado.adversario.vida));
    document.getElementById("energia-jogador").textContent = `${estado.jogador.energia}/${ENERGIA_MAXIMA}`;
    atualizarCronometro();

    textoTurno.textContent = estado.partidaEncerrada
        ? "Partida encerrada"
        : estado.turnoDoJogador
            ? "Seu turno"
            : "Turno do rival";
    indicadorTurno.classList.toggle("turno-adversario", !estado.turnoDoJogador || estado.partidaEncerrada);

    document.getElementById("botao-atacar").disabled = !podeAtacar;
    document.getElementById("botao-trocar").disabled = !podeTrocar;
    document.getElementById("botao-passar").disabled = !estado.turnoDoJogador || estado.partidaEncerrada;
    document.getElementById("botao-desistir").disabled = estado.partidaEncerrada;
    document.getElementById("botao-atacar").setAttribute("aria-label", `Atacar ${cartaAlvoRival.nome} com ${cartaSelecionadaCampo.nome}. Custa 1 energia.`);

    renderizarCampo("cartas-jogador", estado.jogador, "jogador");
    renderizarCampo("cartas-adversario", estado.adversario, "adversario");
    renderizarMao();

    if (seletorFoco) {
        document.querySelector(seletorFoco)?.focus();
    }
}

function exibirMensagem(mensagem, origem = "jogador") {
    const elementoMensagem = document.getElementById("mensagem-batalha");

    elementoMensagem.textContent = mensagem;
    elementoMensagem.classList.toggle("jogador", origem === "jogador");
    elementoMensagem.classList.toggle("adversario", origem === "adversario");
}

function obterSeletorFocoAposAcao() {
    if (estado.partidaEncerrada) {
        return "#botao-desistir";
    }

    return estado.jogador.energia >= 1 ? "#botao-atacar" : "#botao-passar";
}

function trocarCartaDerrotada(lado, descricaoLado) {
    const indiceCartaDerrotada = lado.cartas.findIndex((carta, indice) => indice < TAMANHO_CAMPO && carta.vida <= 0);

    if (indiceCartaDerrotada === -1) {
        return true;
    }

    const cartaDerrotada = lado.cartas[indiceCartaDerrotada];

    lado.vida -= 1;

    if (lado.vida <= 0) {
        const origem = descricaoLado === "jogador" ? "adversario" : "jogador";

        encerrarPartida(descricaoLado === "jogador" ? "Sua carta foi derrotada e sua vida chegou a zero. Rival_03 venceu a partida." : "A carta de Rival_03 foi derrotada e a vida dele chegou a zero. Você venceu a partida.", origem);
        return false;
    }

    if (lado.cartas.length === 1) {
        const origem = descricaoLado === "jogador" ? "adversario" : "jogador";

        encerrarPartida(descricaoLado === "jogador" ? "Você não possui mais cartas. Rival_03 venceu a partida." : "Rival_03 não possui mais cartas. Você venceu a partida.", origem);
        return false;
    }

    lado.cartas.splice(indiceCartaDerrotada, 1);

    if (lado === estado.jogador) {
        if (estado.indiceCartaCampo > indiceCartaDerrotada) {
            estado.indiceCartaCampo -= 1;
        }

        if (estado.indiceCartaCampo >= lado.cartas.length) {
            estado.indiceCartaCampo = 0;
        }

        if (estado.cartaSelecionada !== null && estado.cartaSelecionada > indiceCartaDerrotada) {
            estado.cartaSelecionada -= 1;
        }
    } else {
        if (estado.indiceCartaRival > indiceCartaDerrotada) {
            estado.indiceCartaRival -= 1;
        }

        if (estado.indiceAlvoRival > indiceCartaDerrotada) {
            estado.indiceAlvoRival -= 1;
        }
    }

    if (lado === estado.adversario) {
        if (estado.indiceCartaRival >= lado.cartas.length) {
            estado.indiceCartaRival = 0;
        }

        if (estado.indiceAlvoRival >= lado.cartas.length) {
            estado.indiceAlvoRival = 0;
        }
    }

    exibirMensagem(`${cartaDerrotada.nome} foi derrotado. O ${descricaoLado} perdeu 1 ponto de vida.`, descricaoLado === "jogador" ? "adversario" : "jogador");
    return true;
}

function verificarResultado() {
    return !trocarCartaDerrotada(estado.adversario, "adversário") || !trocarCartaDerrotada(estado.jogador, "jogador");
}

function atacar() {
    if (estado.partidaEncerrada || !estado.turnoDoJogador || estado.jogador.energia < 1) {
        return;
    }

    const cartaJogador = obterCartaEmCampo(estado.jogador, estado.indiceCartaCampo);
    const cartaRival = obterCartaEmCampo(estado.adversario, estado.indiceAlvoRival);

    estado.jogador.energia -= 1;
    cartaRival.vida -= cartaJogador.dano;
    exibirMensagem(`${cartaJogador.nome} causou ${cartaJogador.dano} de dano a ${cartaRival.nome}.`);
    verificarResultado();
    atualizarInterface(obterSeletorFocoAposAcao());
}

function trocarCarta() {
    if (estado.partidaEncerrada || !estado.turnoDoJogador || estado.jogador.energia < 1 || estado.cartaSelecionada === null) {
        return;
    }

    const cartaAtual = obterCartaEmCampo(estado.jogador, estado.indiceCartaCampo);
    const cartaEscolhida = estado.jogador.cartas[estado.cartaSelecionada];

    estado.jogador.cartas[estado.indiceCartaCampo] = cartaEscolhida;
    estado.jogador.cartas[estado.cartaSelecionada] = cartaAtual;
    estado.jogador.energia -= 1;
    estado.cartaSelecionada = null;
    exibirMensagem(`${cartaEscolhida.nome} entrou em campo. A troca consumiu 1 energia.`);
    atualizarInterface(obterSeletorFocoAposAcao());
}

function iniciarTurnoAdversario(seletorFoco = "") {
    estado.turnoDoJogador = false;
    atualizarInterface(seletorFoco);
    exibirMensagem("Rival_03 está escolhendo uma ação.", "adversario");

    window.setTimeout(() => {
        if (estado.partidaEncerrada) {
            return;
        }

        const quantidadeCartasRival = Math.min(TAMANHO_CAMPO, estado.adversario.cartas.length);
        const cartaJogador = obterCartaEmCampo(estado.jogador, estado.indiceCartaCampo);
        const cartaRival = obterCartaEmCampo(estado.adversario, estado.indiceCartaRival);

        cartaJogador.vida -= cartaRival.dano;
        exibirMensagem(`${cartaRival.nome} causou ${cartaRival.dano} de dano a ${cartaJogador.nome}.`, "adversario");

        if (verificarResultado()) {
            atualizarInterface();
            return;
        }

        estado.turnoDoJogador = true;
        estado.jogador.energia = Math.min(ENERGIA_MAXIMA, estado.jogador.energia + 1);
        estado.indiceCartaRival = (estado.indiceCartaRival + 1) % quantidadeCartasRival;
        estado.segundosRestantes = TEMPO_INICIAL;
        exibirMensagem("Seu turno começou. Você recuperou 1 energia.");
        atualizarInterface();
    }, 800);
}

function passarTurno() {
    if (!estado.partidaEncerrada && estado.turnoDoJogador) {
        iniciarTurnoAdversario("#botao-desistir");
    }
}

function encerrarPartida(mensagem, origem = "jogador") {
    estado.partidaEncerrada = true;
    window.clearInterval(intervaloCronometro);
    exibirMensagem(mensagem, origem);
}

function configurarCronometro() {
    intervaloCronometro = window.setInterval(() => {
        if (estado.partidaEncerrada || !estado.turnoDoJogador) {
            return;
        }

        estado.segundosRestantes -= 1;

        if (estado.segundosRestantes <= 0) {
            estado.segundosRestantes = 0;
            atualizarCronometro();
            exibirMensagem("O tempo do turno terminou.");
            passarTurno();
            return;
        }

        atualizarCronometro();
    }, 1000);
}

function configurarEventos() {
    document.getElementById("botao-atacar").addEventListener("click", atacar);
    document.getElementById("botao-trocar").addEventListener("click", trocarCarta);
    document.getElementById("botao-passar").addEventListener("click", passarTurno);
    document.getElementById("botao-desistir").addEventListener("click", () => {
        if (!estado.partidaEncerrada) {
            encerrarPartida("Você desistiu da partida. Rival_03 venceu.");
            atualizarInterface();
            window.setTimeout(() => {
                window.location.assign("home.html");
            }, ATRASO_SAIDA_BATALHA);
        }
    });

    document.getElementById("mao-jogador").addEventListener("click", (evento) => {
        const botaoCarta = evento.target.closest(".carta-mao");

        if (!botaoCarta || botaoCarta.disabled) {
            return;
        }

        estado.cartaSelecionada = Number(botaoCarta.dataset.indiceCarta);
        exibirMensagem(`${estado.jogador.cartas[estado.cartaSelecionada].nome} selecionado para troca.`);
        atualizarInterface(`#mao-jogador [data-indice-carta="${estado.cartaSelecionada}"]`);
    });

    document.getElementById("cartas-jogador").addEventListener("click", (evento) => {
        const botaoCarta = evento.target.closest(".botao-carta-campo");

        if (!botaoCarta || botaoCarta.disabled) {
            return;
        }

        estado.indiceCartaCampo = Number(botaoCarta.dataset.indiceCarta);
        exibirMensagem(`${estado.jogador.cartas[estado.indiceCartaCampo].nome} selecionado para atacar ou trocar.`);
        atualizarInterface(`#cartas-jogador [data-indice-carta="${estado.indiceCartaCampo}"]`);
    });

    document.getElementById("cartas-adversario").addEventListener("click", (evento) => {
        const botaoCarta = evento.target.closest(".botao-carta-campo");

        if (!botaoCarta || botaoCarta.disabled) {
            return;
        }

        estado.indiceAlvoRival = Number(botaoCarta.dataset.indiceCarta);
        exibirMensagem(`${estado.adversario.cartas[estado.indiceAlvoRival].nome} foi selecionado como alvo.`);
        atualizarInterface(`#cartas-adversario [data-indice-carta="${estado.indiceAlvoRival}"]`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarInterface();
    configurarEventos();
    configurarCronometro();
});
