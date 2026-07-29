"use strict";

const QUANTIDADE_MAXIMA = 10;
const TEMPO_REESTOQUE = 30 * 60;

const colecoes = [
    {
        primeira: "Hora de Aventura",
        segunda: "Steven Universo",
        combo: "Steven Universo"
    },
    {
        primeira: "O Incrível Mundo de Gumball",
        segunda: "Ben 10",
        combo: "Ben 10"
    },
    {
        primeira: "As Meninas Superpoderosas",
        segunda: "Samurai Jack",
        combo: "Samurai Jack"
    }
];

const produtos = [
    {
        id: "hora-aventura",
        secao: "hora-aventura",
        colecao: "primeira",
        unidade: "pacote",
        quantidadePorUnidade: 1,
        precoMoedas: 100,
        precoReais: 5.99,
        visual: "pacote"
    },
    {
        id: "steven-universo",
        secao: "steven-universo",
        colecao: "segunda",
        unidade: "pacote",
        quantidadePorUnidade: 1,
        precoMoedas: 100,
        precoReais: 5.99,
        visual: "pacote"
    },
    {
        id: "moedas-100",
        secao: "recursos",
        nome: "100 moedas",
        unidade: "moedas",
        quantidadePorUnidade: 100,
        precoMoedas: 0,
        precoReais: 5.99,
        visual: "recurso"
    },
    {
        id: "moedas-500",
        secao: "recursos",
        nome: "500 moedas",
        unidade: "moedas",
        quantidadePorUnidade: 500,
        precoMoedas: 0,
        precoReais: 20.99,
        visual: "recurso"
    },
    {
        id: "moedas-1000",
        secao: "recursos",
        nome: "1000 moedas",
        unidade: "moedas",
        quantidadePorUnidade: 1000,
        precoMoedas: 0,
        precoReais: 37.99,
        visual: "recurso"
    },
    {
        id: "combo-steven",
        secao: "combo",
        colecao: "combo",
        unidade: "pacote",
        quantidadePorUnidade: 10,
        precoMoedas: 700,
        precoReais: 24.99,
        visual: "pacote"
    }
];

const quantidades = new Map(produtos.map((produto) => [produto.id, 1]));
let segundosRestantes = TEMPO_REESTOQUE;
let indiceColecao = 0;

function formatarReais(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function textoQuantidade(produto, quantidade) {
    const total = produto.quantidadePorUnidade * quantidade;

    if (produto.unidade === "moedas") {
        return `${total} moedas`;
    }

    return `${total} ${total === 1 ? "pacote" : "pacotes"}`;
}

function obterNomeProduto(produto) {
    return produto.colecao ? colecoes[indiceColecao][produto.colecao] : produto.nome;
}

function criarVisualProduto(produto) {
    const visual = document.createElement("div");

    visual.className = `visual-${produto.visual}`;

    if (produto.visual === "pacote") {
        const imagem = document.createElement("img");
        const quantidade = document.createElement("span");

        imagem.src = "../images/logos/cards-stack-outline.png";
        imagem.alt = "";
        quantidade.className = "produto-quantidade quantidade-pacote";
        quantidade.dataset.campo = "quantidade";
        visual.append(quantidade, imagem);
    } else {
        const icone = document.createElement("img");

        visual.setAttribute("aria-hidden", "true");
        icone.src = "../images/icons/diamond-badge.png";
        icone.alt = "";
        visual.append(icone);
    }

    return visual;
}

function criarBotaoQuantidade(produto, acao, rotulo) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "botao-quantidade";
    botao.dataset.idProduto = produto.id;
    botao.dataset.acao = acao;
    botao.setAttribute("aria-label", `${rotulo} quantidade de ${obterNomeProduto(produto)}`);
    botao.textContent = acao === "diminuir" ? "−" : "+";

    return botao;
}

function criarProduto(produto) {
    const item = document.createElement("li");
    const informacoes = document.createElement("div");
    const cabecalho = document.createElement("div");
    const quantidade = produto.visual === "pacote" ? null : document.createElement("span");
    const nome = document.createElement("h3");
    const preco = document.createElement("p");
    const controles = document.createElement("div");
    const valorQuantidade = document.createElement("output");
    const acoes = document.createElement("div");
    const comprarMoeda = document.createElement("button");
    const comprarReais = document.createElement("button");

    item.className = "produto-loja";
    item.dataset.idProduto = produto.id;
    informacoes.className = "informacoes-produto";
    cabecalho.className = "produto-cabecalho";
    if (quantidade) {
        quantidade.className = "produto-quantidade";
        quantidade.dataset.campo = "quantidade";
    }
    nome.className = "produto-nome";
    preco.className = "produto-preco";
    preco.dataset.campo = "preco";
    controles.className = "controles-quantidade";
    valorQuantidade.className = "valor-quantidade";
    valorQuantidade.dataset.campo = "valor-quantidade";
    valorQuantidade.setAttribute("aria-live", "polite");
    acoes.className = "acoes-produto";
    comprarMoeda.type = "button";
    comprarMoeda.className = "botao-compra";
    comprarMoeda.dataset.idProduto = produto.id;
    comprarMoeda.dataset.metodo = "moedas";
    comprarMoeda.dataset.campo = "comprar-moedas";
    comprarReais.type = "button";
    comprarReais.className = "botao-compra secundario";
    comprarReais.dataset.idProduto = produto.id;
    comprarReais.dataset.metodo = "reais";
    comprarReais.dataset.campo = "comprar-reais";

    nome.textContent = obterNomeProduto(produto);
    controles.append(
        criarBotaoQuantidade(produto, "diminuir", "Diminuir"),
        valorQuantidade,
        criarBotaoQuantidade(produto, "aumentar", "Aumentar")
    );
    acoes.append(comprarMoeda, comprarReais);
    if (quantidade) {
        cabecalho.append(quantidade);
    }

    cabecalho.append(nome);
    informacoes.append(cabecalho, preco, controles, acoes);
    item.append(criarVisualProduto(produto), informacoes);

    atualizarProduto(item, produto);
    return item;
}

function atualizarProduto(item, produto) {
    const quantidade = quantidades.get(produto.id);
    const precoMoedas = produto.precoMoedas * quantidade;
    const precoReais = produto.precoReais * quantidade;
    const campoQuantidade = item.querySelector('[data-campo="quantidade"]');
    const campoPreco = item.querySelector('[data-campo="preco"]');
    const campoValor = item.querySelector('[data-campo="valor-quantidade"]');
    const botaoDiminuir = item.querySelector('[data-acao="diminuir"]');
    const botaoAumentar = item.querySelector('[data-acao="aumentar"]');
    const botaoMoedas = item.querySelector('[data-campo="comprar-moedas"]');
    const botaoReais = item.querySelector('[data-campo="comprar-reais"]');

    campoQuantidade.textContent = textoQuantidade(produto, quantidade);
    campoValor.textContent = String(quantidade);
    botaoDiminuir.disabled = quantidade === 1;
    botaoAumentar.disabled = quantidade === QUANTIDADE_MAXIMA;

    campoPreco.replaceChildren();

    if (precoMoedas > 0) {
        const moeda = document.createElement("span");
        const icone = document.createElement("img");
        const textoMoeda = document.createElement("span");
        const separador = document.createElement("span");
        const textoReais = document.createElement("span");

        moeda.className = "preco-moeda";
        icone.src = "../images/icons/diamond-badge.png";
        icone.alt = "";
        textoMoeda.textContent = String(precoMoedas);
        separador.className = "separador-preco";
        separador.textContent = "ou";
        textoReais.textContent = formatarReais(precoReais);
        moeda.append(icone, textoMoeda);
        campoPreco.append(moeda, separador, textoReais);
        botaoMoedas.hidden = false;
        botaoMoedas.textContent = `Comprar ${quantidade > 1 ? `${quantidade}x ` : ""}com moeda`;
    } else {
        campoPreco.textContent = formatarReais(precoReais);
        botaoMoedas.hidden = true;
    }

    botaoReais.textContent = produto.precoMoedas === 0
        ? `Comprar ${quantidade > 1 ? `${quantidade}x` : ""}`.trim()
        : `Comprar ${quantidade > 1 ? `${quantidade}x ` : ""}em R$`;
}

function renderizarLoja() {
    const grade = document.getElementById("grade-loja");
    const estado = document.getElementById("estado-loja");
    const configuracoesSecao = [
        { id: "hora-aventura", titulo: "Pacote Hora de Aventura", classe: "destaque" },
        { id: "steven-universo", titulo: "Pacote Steven Universo", classe: "destaque" },
        { id: "recursos", titulo: "Recursos", classe: "recursos" },
        { id: "combo", titulo: "Combo", classe: "combo" }
    ];
    const fragmento = document.createDocumentFragment();

    try {
        configuracoesSecao.forEach((configuracao) => {
            const produtosSecao = produtos.filter((produto) => produto.secao === configuracao.id);
            const secao = document.createElement("section");
            const titulo = document.createElement("h2");
            const lista = document.createElement("ul");

            secao.className = `secao-loja ${configuracao.classe}`;
            titulo.textContent = configuracao.titulo;
            lista.className = "lista-produtos";

            if (configuracao.id === "recursos") {
                lista.classList.add("lista-recursos");
            }

            produtosSecao.forEach((produto) => {
                lista.append(criarProduto(produto));
            });

            secao.append(titulo, lista);
            fragmento.append(secao);
        });

        grade.replaceChildren(fragmento);
        estado.textContent = `${produtos.length} produtos disponíveis na loja.`;
    } catch {
        grade.replaceChildren();
        estado.textContent = "Não foi possível carregar a loja. Atualize a página e tente novamente.";
    }
}

function exibirMensagem(mensagem) {
    document.getElementById("mensagem-loja").textContent = mensagem;
}

function atualizarQuantidade(idProduto, variacao) {
    const produto = produtos.find((item) => item.id === idProduto);
    const quantidadeAtual = quantidades.get(idProduto);
    const novaQuantidade = quantidadeAtual + variacao;

    if (!produto || novaQuantidade < 1 || novaQuantidade > QUANTIDADE_MAXIMA) {
        return;
    }

    quantidades.set(idProduto, novaQuantidade);
    atualizarProduto(document.querySelector(`[data-id-produto="${idProduto}"]`), produto);
    exibirMensagem(`${textoQuantidade(produto, novaQuantidade)} de ${obterNomeProduto(produto)} selecionado${novaQuantidade > 1 ? "s" : ""}.`);
}

function confirmarCompra(idProduto, metodo) {
    const produto = produtos.find((item) => item.id === idProduto);
    const quantidade = quantidades.get(idProduto);

    if (!produto) {
        return;
    }

    if (metodo === "reais") {
        const pedido = {
            descricao: `${textoQuantidade(produto, quantidade)} de ${obterNomeProduto(produto)}`,
            total: produto.precoReais * quantidade,
            pacotes: produto.visual === "pacote" ? produto.quantidadePorUnidade * quantidade : 0
        };

        try {
            sessionStorage.setItem("pedido-pendente", JSON.stringify(pedido));
            window.location.assign("pagamento.html");
        } catch {
            exibirMensagem("Não foi possível iniciar o pagamento. Atualize a página e tente novamente.");
        }

        return;
    }

    exibirMensagem(`Compra local de ${textoQuantidade(produto, quantidade)} de ${obterNomeProduto(produto)} por ${produto.precoMoedas * quantidade} moedas confirmada.`);
}

function formatarTempoReestoque() {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function atualizarCronometro() {
    const cronometro = document.getElementById("cronometro-reestoque");

    cronometro.textContent = formatarTempoReestoque();
}

function configurarCronometro() {
    atualizarCronometro();

    window.setInterval(() => {
        if (segundosRestantes <= 1) {
            indiceColecao = (indiceColecao + 1) % colecoes.length;
            segundosRestantes = TEMPO_REESTOQUE;
            renderizarLoja();
            exibirMensagem("As coleções foram atualizadas. Todos os produtos continuam disponíveis.");
        } else {
            segundosRestantes -= 1;
        }

        atualizarCronometro();
    }, 1000);
}

function configurarInteracoes() {
    document.getElementById("grade-loja").addEventListener("click", (evento) => {
        const botaoQuantidade = evento.target.closest(".botao-quantidade");
        const botaoCompra = evento.target.closest(".botao-compra");

        if (botaoQuantidade && !botaoQuantidade.disabled) {
            atualizarQuantidade(botaoQuantidade.dataset.idProduto, botaoQuantidade.dataset.acao === "aumentar" ? 1 : -1);
            return;
        }

        if (botaoCompra && !botaoCompra.hidden) {
            confirmarCompra(botaoCompra.dataset.idProduto, botaoCompra.dataset.metodo);
        }
    });

}

document.addEventListener("DOMContentLoaded", () => {
    renderizarLoja();
    configurarInteracoes();
    configurarCronometro();
});
