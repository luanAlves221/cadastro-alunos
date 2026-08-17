const formulario = document.getElementById("form-turma");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensagem.textContent = "";

    const turma = {
        curso: document.getElementById("curso").value,
        modulo: document.getElementById("modulo").value,
        ano: document.getElementById("ano").value
    };

    try {
        const resposta = await fetch("/turmas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(turma)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "Turma cadastrada com sucesso!";
            formulario.reset();
            console.log("Turma cadastrada:", resultado);
        } else {
            mensagem.textContent =
                "Erro ao cadastrar turma: " + obterMensagemErro(resultado);

            console.error("Erro da API:", resultado);
        }

    } catch (erro) {
        mensagem.textContent =
            "Não foi possível conectar ao servidor.";

        console.error("Erro de conexão:", erro);
    }
});


function obterMensagemErro(resultado) {
    if (!resultado.detail) {
        return "Dados inválidos.";
    }

    if (Array.isArray(resultado.detail)) {
        return resultado.detail
            .map(erro => {
                const campo = erro.loc?.[1];

                if (campo === "curso") return "Curso inválido.";
                if (campo === "modulo") return "Módulo inválido.";
                if (campo === "ano") return "Ano inválido.";

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}