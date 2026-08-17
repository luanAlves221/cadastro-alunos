const formulario = document.getElementById("form-funcionario");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensagem.textContent = "";

    const funcionario = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        cargo: document.getElementById("cargo").value,
        setor: document.getElementById("setor").value
    };

    try {
        const resposta = await fetch("/funcionarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "Funcionário cadastrado com sucesso!";
            formulario.reset();
            console.log("Funcionário cadastrado:", resultado);
        } else {
            mensagem.textContent =
                "Erro ao cadastrar funcionário: " + obterMensagemErro(resultado);

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

                if (campo === "email") return "E-mail inválido.";
                if (campo === "nome") return "Nome inválido.";
                if (campo === "cpf") return "CPF inválido.";
                if (campo === "cargo") return "Cargo inválido.";
                if (campo === "setor") return "Setor inválido.";

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}