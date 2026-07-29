"use strict";

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

function exibirErroCampo(campo, mensagem) {
    const elementoErro = document.getElementById(`erro-${campo.id}`);

    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    elementoErro.textContent = mensagem;
}

function validarFormulario(formulario) {
    const campos = formulario.querySelectorAll("input[required]");
    let primeiroCampoInvalido = null;

    campos.forEach((campo) => {
        const mensagem = obterMensagemCampo(campo, formulario);

        exibirErroCampo(campo, mensagem);

        if (mensagem && !primeiroCampoInvalido) {
            primeiroCampoInvalido = campo;
        }
    });

    return primeiroCampoInvalido;
}

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

        if (ehCadastro) {
            mensagemFormulario.textContent = "Dados validados. O cadastro ainda não está conectado a um servidor.";
            return;
        }

        mensagemFormulario.textContent = ehRedefinicaoSenha
            ? "Senha validada. O e-mail de confirmação ainda não está conectado a um servidor."
            : "Dados validados. O login ainda não está conectado a um servidor.";
    });

    formulario.querySelectorAll("input[required]").forEach((campo) => {
        campo.addEventListener("input", () => {
            exibirErroCampo(campo, obterMensagemCampo(campo, formulario));
        });
    });
}

function configurarFormulariosAutenticacao() {
    const formularios = document.querySelectorAll(".formulario-login, .formulario-cadastro, .formulario-redefinir-senha");

    formularios.forEach(configurarFormulario);
}

document.addEventListener("DOMContentLoaded", configurarFormulariosAutenticacao);