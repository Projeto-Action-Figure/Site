"use strict";

const PEDIDO_PADRAO = {
    descricao: "1 pacote",
    total: 5.99,
    pacotes: 0
};

let metodoSelecionado = "";

function formatarReais(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterPedidoPendente() {
    try {
        const pedidoArmazenado = sessionStorage.getItem("pedido-pendente");

        if (!pedidoArmazenado) {
            return PEDIDO_PADRAO;
        }

        const pedido = JSON.parse(pedidoArmazenado);

        if (typeof pedido.descricao !== "string" || !Number.isFinite(pedido.total) || pedido.total <= 0) {
            return PEDIDO_PADRAO;
        }

        return {
            descricao: pedido.descricao,
            total: pedido.total,
            pacotes: Number.isInteger(pedido.pacotes) && pedido.pacotes > 0 ? pedido.pacotes : 0
        };
    } catch {
        return PEDIDO_PADRAO;
    }
}

function atualizarFormularioCartao(ativo) {
    const camposCartao = document.getElementById("campos-cartao");

    camposCartao.hidden = !ativo;
    camposCartao.querySelectorAll("input").forEach((campo) => {
        campo.disabled = !ativo;
        campo.required = ativo;
    });
}

function selecionarMetodo(metodo) {
    metodoSelecionado = metodo;

    document.getElementById("metodo-pix").setAttribute("aria-pressed", String(metodo === "pix"));
    document.getElementById("metodo-cartao").setAttribute("aria-pressed", String(metodo === "cartao"));
    document.getElementById("instrucoes-pix").hidden = metodo !== "pix";
    document.getElementById("botao-finalizar").disabled = false;
    document.getElementById("mensagem-pagamento").textContent = "";
    document.getElementById("erro-cartao").textContent = "";
    atualizarFormularioCartao(metodo === "cartao");
}

function validarCartao() {
    const numero = document.getElementById("numero-cartao").value.replace(/\D/g, "");
    const validade = document.getElementById("validade-cartao").value;
    const codigo = document.getElementById("codigo-cartao").value.replace(/\D/g, "");
    const erro = document.getElementById("erro-cartao");

    if (numero.length < 13 || numero.length > 19) {
        erro.textContent = "Informe um número de cartão válido.";
        document.getElementById("numero-cartao").focus();
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        erro.textContent = "Informe a validade no formato MM/AA.";
        document.getElementById("validade-cartao").focus();
        return false;
    }

    if (codigo.length < 3 || codigo.length > 4) {
        erro.textContent = "Informe o código de segurança do cartão.";
        document.getElementById("codigo-cartao").focus();
        return false;
    }

    erro.textContent = "";
    return true;
}

function adicionarPacotesAoInventario(pedido) {
    if (!pedido.pacotes) {
        return 0;
    }

    try {
        const quantidadeAtual = Number.parseInt(localStorage.getItem("pacotes-pendentes") ?? "0", 10);
        const quantidadeSegura = Number.isInteger(quantidadeAtual) && quantidadeAtual > 0 ? quantidadeAtual : 0;

        localStorage.setItem("pacotes-pendentes", String(quantidadeSegura + pedido.pacotes));
        return pedido.pacotes;
    } catch {
        return 0;
    }
}

function concluirPedido(pedido) {
    const formulario = document.getElementById("formulario-pagamento");
    const confirmacao = document.getElementById("confirmacao-pagamento");
    const texto = document.getElementById("texto-confirmacao");
    const descricaoMetodo = metodoSelecionado === "pix" ? "PIX" : "cartão";
    const pacotesRecebidos = adicionarPacotesAoInventario(pedido);
    const mensagemPacotes = pacotesRecebidos
        ? ` ${pacotesRecebidos === 1 ? "Um pacote foi adicionado" : `${pacotesRecebidos} pacotes foram adicionados`} à sua coleção.`
        : "";

    texto.textContent = `${pedido.descricao} no valor de ${formatarReais(pedido.total)} foi confirmado por ${descricaoMetodo}.${mensagemPacotes}`;
    formulario.hidden = true;
    confirmacao.hidden = false;
    confirmacao.focus();

    try {
        sessionStorage.removeItem("pedido-pendente");
    } catch {
        document.getElementById("mensagem-pagamento").textContent = "O pedido foi confirmado, mas não foi possível limpar o resumo da compra.";
    }
}

function configurarFormulario(pedido) {
    document.getElementById("metodo-pix").addEventListener("click", () => selecionarMetodo("pix"));
    document.getElementById("metodo-cartao").addEventListener("click", () => selecionarMetodo("cartao"));

    document.getElementById("formulario-pagamento").addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!metodoSelecionado) {
            document.getElementById("mensagem-pagamento").textContent = "Escolha um método de pagamento para continuar.";
            return;
        }

        if (metodoSelecionado === "cartao" && !validarCartao()) {
            return;
        }

        concluirPedido(pedido);
    });
}

function iniciarPagamento() {
    const pedido = obterPedidoPendente();

    document.getElementById("valor-pedido").textContent = formatarReais(pedido.total);
    document.getElementById("descricao-pedido").textContent = pedido.descricao;
    atualizarFormularioCartao(false);
    configurarFormulario(pedido);
}

document.addEventListener("DOMContentLoaded", iniciarPagamento);