const formulario = document.getElementById("form-turma-aluno");
const mensagem = document.getElementById("mensagem");

carregarOpcoes();

async function carregarOpcoes() {
    try {
        const respostaTurmas = await fetch("/turmas");
        const turmas = await respostaTurmas.json();

        const respostaAlunos = await fetch("/alunos");
        const alunos = await respostaAlunos.json();

        const selectTurma = document.getElementById("codTurma");
        const selectAluno = document.getElementById("codAluno");

        turmas.forEach(turma => {
            const opcao = document.createElement("option");
            opcao.value = turma.codTurma;
            opcao.textContent = turma.codTurma + " - " + turma.curso;
            selectTurma.appendChild(opcao);
        });

        alunos.forEach(aluno => {
            const opcao = document.createElement("option");
            opcao.value = aluno.codAluno;
            opcao.textContent = aluno.codAluno + " - " + aluno.nome;
            selectAluno.appendChild(opcao);
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

    const turmaAluno = {
        codTurma: document.getElementById("codTurma").value,
        codAluno: document.getElementById("codAluno").value
    };

    try {
        const resposta = await fetch("/turma-alunos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(turmaAluno)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = "Aluno vinculado à turma com sucesso!";
            formulario.reset();
            console.log("Turma e aluno vinculados:", resultado);
        } else {
            mensagem.textContent =
                "Erro ao vincular aluno à turma: " + obterMensagemErro(resultado);

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
                if (campo === "codAluno") return "Aluno inválido.";

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}