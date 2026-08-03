"use strict";

// Pedido usado quando não há nenhuma compra pendente salva pela loja
const PEDIDO_PADRAO = {
    descricao: "1 pacote",
    total: 5.99,
    pacotes: 0
};

// Guarda o método de pagamento escolhido (pix ou cartão)
let metodoSelecionado = "";

// Formata um número como moeda em reais (R$)
function formatarReais(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Lê e valida o pedido pendente salvo pela loja, usando o padrão se não houver ou for inválido
function obterPedidoPendente() {
    try {
        const pedidoArmazenado = sessionStorage.getItem("pedido-pendente");

        if (!pedidoArmazenado) {
            return PEDIDO_PADRAO;
        }

        const pedido = JSON.parse(pedidoArmazenado);

        // Validação defensiva para evitar quebrar a página com dados antigos/corrompidos.
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

// Habilita ou desabilita os campos do formulário de cartão
function atualizarFormularioCartao(ativo) {
    const camposCartao = document.getElementById("campos-cartao");

    camposCartao.hidden = !ativo;
    camposCartao.querySelectorAll("input").forEach((campo) => {
        campo.disabled = !ativo;
        campo.required = ativo;
    });
}

// Marca o método de pagamento escolhido e ajusta a tela de acordo
function selecionarMetodo(metodo) {
    metodoSelecionado = metodo;

    document.getElementById("metodo-pix").setAttribute("aria-pressed", String(metodo === "pix"));
    document.getElementById("metodo-cartao").setAttribute("aria-pressed", String(metodo === "cartao"));
    document.getElementById("instrucoes-pix").hidden = metodo !== "pix";
    document.getElementById("botao-finalizar").disabled = false;
    // Sempre limpa mensagens antigas ao trocar o método para evitar confusão.
    document.getElementById("mensagem-pagamento").textContent = "";
    document.getElementById("erro-cartao").textContent = "";
    atualizarFormularioCartao(metodo === "cartao");
}

// Valida número, validade e código de segurança do cartão
function validarCartao() {
    // Remove qualquer caractere não numérico antes das validações de tamanho.
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

// Soma os pacotes comprados ao estoque de pacotes pendentes salvo no localStorage
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

// Confirma o pedido, credita os pacotes comprados e mostra a mensagem de confirmação
function concluirPedido(pedido) {
    const formulario = document.getElementById("formulario-pagamento");
    const confirmacao = document.getElementById("confirmacao-pagamento");
    const texto = document.getElementById("texto-confirmacao");
    const descricaoMetodo = metodoSelecionado === "pix" ? "PIX" : "cartão";
    const pacotesRecebidos = adicionarPacotesAoInventario(pedido);
    // Só acrescenta o trecho sobre pacotes quando a compra realmente concede pacotes.
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

// Liga os botões de método de pagamento e o envio do formulário
function configurarFormulario(pedido) {
    document.getElementById("metodo-pix").addEventListener("click", () => selecionarMetodo("pix"));
    document.getElementById("metodo-cartao").addEventListener("click", () => selecionarMetodo("cartao"));

    document.getElementById("formulario-pagamento").addEventListener("submit", (evento) => {
        evento.preventDefault();

        // Sem método selecionado, o pedido não pode ser finalizado.
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

// Carrega o pedido pendente e prepara a tela de pagamento
function iniciarPagamento() {
    const pedido = obterPedidoPendente();

    document.getElementById("valor-pedido").textContent = formatarReais(pedido.total);
    document.getElementById("descricao-pedido").textContent = pedido.descricao;
    atualizarFormularioCartao(false);
    configurarFormulario(pedido);
}

// Inicia a tela de pagamento quando a página carrega
document.addEventListener("DOMContentLoaded", iniciarPagamento);