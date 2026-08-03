"use strict";

// Verifica um campo do formulário e retorna a mensagem de erro correspondente (ou vazio se estiver válido)
function obterMensagemCampo(campo, formulario) {
    if (campo.validity.valueMissing) {
        return "Preencha este campo.";
    }

    if (campo.type === "email" && campo.validity.typeMismatch) {
        return "Informe um endereço de e-mail válido.";
    }

    if (campo.validity.tooShort) {
        return `Informe ao menos ${campo.minLength} caracteres.`;
    }

    if (campo.id === "confirmar-senha" && campo.value !== formulario.elements.senha.value) {
        return "As senhas precisam ser iguais.";
    }

    return "";
}

// Mostra (ou limpa) a mensagem de erro de um campo e atualiza o aria-invalid
function exibirErroCampo(campo, mensagem) {
    const elementoErro = document.getElementById(`erro-${campo.id}`);

    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    elementoErro.textContent = mensagem;
}

// Valida todos os campos obrigatórios do formulário e retorna o primeiro campo inválido
function validarFormulario(formulario) {
    const campos = formulario.querySelectorAll("input[required]");
    let primeiroCampoInvalido = null;

    campos.forEach((campo) => {
        // Cada campo é validado de forma independente para mostrar todos os erros de uma vez.
        const mensagem = obterMensagemCampo(campo, formulario);

        exibirErroCampo(campo, mensagem);

        // Guardamos apenas o primeiro inválido para direcionar o foco após a validação.
        if (mensagem && !primeiroCampoInvalido) {
            primeiroCampoInvalido = campo;
        }
    });

    return primeiroCampoInvalido;
}

// Configura a validação e o envio de um formulário (login, cadastro ou redefinição de senha)
function configurarFormulario(formulario) {
    const mensagemFormulario = formulario.querySelector(".mensagem-formulario");
    const ehCadastro = formulario.classList.contains("formulario-cadastro");
    const ehRedefinicaoSenha = formulario.classList.contains("formulario-redefinir-senha");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const primeiroCampoInvalido = validarFormulario(formulario);

        if (primeiroCampoInvalido) {
            mensagemFormulario.textContent = "Revise os campos indicados antes de continuar.";
            primeiroCampoInvalido.focus();
            return;
        }

        // Redefinição de senha para no feedback local; login e cadastro seguem para a home.
        if (ehRedefinicaoSenha) {
            mensagemFormulario.textContent = "Senha validada. O e-mail de confirmação ainda não está conectado a um servidor.";
            return;
        }

        window.location.assign("home.html");
    });

    formulario.querySelectorAll("input[required]").forEach((campo) => {
        campo.addEventListener("input", () => {
            exibirErroCampo(campo, obterMensagemCampo(campo, formulario));
        });
    });
}

// Aplica a configuração de validação a todos os formulários de autenticação da página
function configurarFormulariosAutenticacao() {
    const formularios = document.querySelectorAll(".formulario-login, .formulario-cadastro, .formulario-redefinir-senha");

    formularios.forEach(configurarFormulario);
}

// Inicia a validação dos formulários assim que a página carrega
document.addEventListener("DOMContentLoaded", configurarFormulariosAutenticacao);