"use strict";

function obterMensagemCampo(campo) {
    if (campo.validity.valueMissing) {
        return "Preencha este campo.";
    }

    if (campo.type === "email" && campo.validity.typeMismatch) {
        return "Informe um endereço de e-mail válido.";
    }

    return "";
}

function exibirErroCampo(campo, mensagem) {
    const elementoErro = document.getElementById(`erro-${campo.id}`);

    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    elementoErro.textContent = mensagem;
}

function validarFormularioLogin(formulario) {
    const campos = formulario.querySelectorAll("input[required]");
    let primeiroCampoInvalido = null;

    campos.forEach((campo) => {
        const mensagem = obterMensagemCampo(campo);

        exibirErroCampo(campo, mensagem);

        if (mensagem && !primeiroCampoInvalido) {
            primeiroCampoInvalido = campo;
        }
    });

    return primeiroCampoInvalido;
}

function configurarFormularioLogin() {
    const formulario = document.querySelector(".formulario-login");

    if (!formulario) {
        return;
    }

    const mensagemLogin = document.getElementById("mensagem-login");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const primeiroCampoInvalido = validarFormularioLogin(formulario);

        if (primeiroCampoInvalido) {
            mensagemLogin.textContent = "Revise os campos indicados antes de continuar.";
            primeiroCampoInvalido.focus();
            return;
        }

        mensagemLogin.textContent = "Dados validados. O login ainda não está conectado a um servidor.";
    });

    formulario.querySelectorAll("input[required]").forEach((campo) => {
        campo.addEventListener("input", () => {
            exibirErroCampo(campo, obterMensagemCampo(campo));
        });
    });
}

document.addEventListener("DOMContentLoaded", configurarFormularioLogin);