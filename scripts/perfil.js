"use strict";

function obterMensagemErro(campo) {
    if (campo.validity.valueMissing) {
        return "Preencha este campo.";
    }

    if (campo.type === "email" && campo.validity.typeMismatch) {
        return "Informe um endereço de e-mail válido.";
    }

    return "";
}

function exibirErro(campo, mensagem) {
    document.getElementById(`erro-${campo.id}`).textContent = mensagem;
    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
}

function configurarFormularioPerfil() {
    const formulario = document.querySelector(".formulario-perfil");
    const mensagemPerfil = document.getElementById("mensagem-perfil");
    const campos = formulario.querySelectorAll("input[required]");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let primeiroCampoInvalido = null;

        campos.forEach((campo) => {
            const mensagem = obterMensagemErro(campo);

            exibirErro(campo, mensagem);

            if (mensagem && !primeiroCampoInvalido) {
                primeiroCampoInvalido = campo;
            }
        });

        if (primeiroCampoInvalido) {
            mensagemPerfil.textContent = "Revise os campos indicados antes de salvar.";
            primeiroCampoInvalido.focus();
            return;
        }

        mensagemPerfil.textContent = "Dados salvos localmente. A sincronização com o servidor será adicionada em breve.";
    });

    campos.forEach((campo) => {
        campo.addEventListener("input", () => {
            exibirErro(campo, obterMensagemErro(campo));
        });
    });
}

document.addEventListener("DOMContentLoaded", configurarFormularioPerfil);
