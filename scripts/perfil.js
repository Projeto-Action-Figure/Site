"use strict";

// Verifica um campo do formulário de perfil e retorna a mensagem de erro correspondente
function obterMensagemErro(campo) {
    if (campo.validity.valueMissing) {
        return "Preencha este campo.";
    }

    if (campo.type === "email" && campo.validity.typeMismatch) {
        return "Informe um endereço de e-mail válido.";
    }

    return "";
}

// Mostra a mensagem de erro do campo e atualiza o aria-invalid
function exibirErro(campo, mensagem) {
    document.getElementById(`erro-${campo.id}`).textContent = mensagem;
    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
}

// Valida os campos e trata o envio do formulário de perfil
function configurarFormularioPerfil() {
    const formulario = document.querySelector(".formulario-perfil");
    const mensagemPerfil = document.getElementById("mensagem-perfil");
    const campos = formulario.querySelectorAll("input[required]");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let primeiroCampoInvalido = null;

        campos.forEach((campo) => {
            // Mostra todos os erros dos campos e guarda o primeiro para foco.
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

// Inicia a validação do perfil quando a página carrega
document.addEventListener("DOMContentLoaded", configurarFormularioPerfil);
