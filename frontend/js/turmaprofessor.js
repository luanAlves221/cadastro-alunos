const formulario = document.getElementById("form-turma-professor");
const mensagem = document.getElementById("mensagem");

carregarOpcoes();

async function carregarOpcoes() {
    try {
        const respostaTurmas = await fetch("/turmas");
        const turmas = await respostaTurmas.json();

        const respostaProfessores = await fetch("/professores");
        const professores = await respostaProfessores.json();

        const selectTurma = document.getElementById("codTurma");
        const selectProfessor = document.getElementById("codProf");

        turmas.forEach(turma => {
            const opcao = document.createElement("option");
            opcao.value = turma.codTurma;
            opcao.textContent = turma.codTurma + " - " + turma.curso;
            selectTurma.appendChild(opcao);
        });

        professores.forEach(professor => {
            const opcao = document.createElement("option");
            opcao.value = professor.codProf;
            opcao.textContent = professor.codProf + " - " + professor.nome;
            selectProfessor.appendChild(opcao);
        });

    } catch (erro) {
        mensagem.textContent =
            "Não foi possível carregar as opções.";

        console.error("Erro ao carregar opções:", erro);
    }
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensagem.textContent = "";

    const turmaProfessor = {
        codTurma: document.getElementById("codTurma").value,
        codProf: document.getElementById("codProf").value
    };

    try {
        const resposta = await fetch("/turma-professores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(turmaProfessor)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "Professor vinculado à turma com sucesso!";
            formulario.reset();
            console.log("Turma e professor vinculados:", resultado);
        } else {
            mensagem.textContent =
                "Erro ao vincular professor à turma: " + obterMensagemErro(resultado);

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

                if (campo === "codTurma") return "Turma inválida.";
                if (campo === "codProf") return "Professor inválido.";

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}