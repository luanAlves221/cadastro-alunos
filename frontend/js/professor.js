let professores = [];

const parametros = new URLSearchParams(window.location.search);
const codProf = parametros.get("codProf");

const formulario = document.getElementById("form-professor");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        mensagem.textContent = "";

        const btnSalvar = document.getElementById("btnSalvar");
        if (btnSalvar) {
            btnSalvar.disabled = true;
        }

        const professor = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value
        };

        try {
            let resposta;

            if (codProf) {
                resposta = await fetch(`/professores/${codProf}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(professor)
                });
            } else {
                resposta = await fetch("/professores", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(professor)
                });
            }

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (codProf) {
                    mensagem.textContent = "Professor alterado com sucesso!";
                    setTimeout(() => {
                        window.location.href = "/frontend/professores.html";
                    }, 1200);
                } else {
                    mensagem.textContent = "Professor cadastrado com sucesso!";
                    formulario.reset();
                    if (btnSalvar) {
                        btnSalvar.disabled = false;
                    }
                }
            } else {
                mensagem.textContent =
                    "Erro: " + obterMensagemErro(resultado);

                if (btnSalvar) {
                    btnSalvar.disabled = false;
                }

                console.error("Erro da API:", resultado);
            }

        } catch (erro) {
            mensagem.textContent =
                "Não foi possível conectar ao servidor.";

            if (btnSalvar) {
                btnSalvar.disabled = false;
            }

            console.error("Erro de conexão:", erro);
        }
    });
}

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
                if (campo === "data_nascimento") return "Data de nascimento inválida.";
                if (campo === "telefone") return "Telefone inválido.";

                return erro.msg;
            })
            .join(" ");
    }

    return resultado.detail;
}

function alterarProfessor(codProf) {
    window.location.href = `/cadastro-de-professor?codProf=${codProf}`;
}

async function carregarProfessorParaAlteracao() {
    if (!codProf || !formulario) {
        return;
    }

    try {
        const resposta = await fetch("/professores");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar professores.");
        }

        const listaProfessores = await resposta.json();

        const professor = listaProfessores.find(
            item => item.codProf == codProf
        );

        if (!professor) {
            mensagem.textContent = "Professor não encontrado.";
            return;
        }

        document.getElementById("nome").value = professor.nome;
        document.getElementById("cpf").value = professor.cpf;
        document.getElementById("email").value = professor.email;
        document.getElementById("data_nascimento").value = professor.data_nascimento;
        document.getElementById("telefone").value = professor.telefone;

        const titulo = document.getElementById("tituloFormulario");
        if (titulo) {
            titulo.textContent = "Alterar Professor";
        }

        const btnSalvar = document.getElementById("btnSalvar");
        if (btnSalvar) {
            btnSalvar.textContent = "Salvar alterações";
        }

    } catch (erro) {
        console.error("Erro ao carregar professor:", erro);
        mensagem.textContent = "Não foi possível carregar os dados do professor.";
    }
}

async function carregarProfessores() {
    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/professores");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar professores.");
        }

        professores = await resposta.json();

        exibirProfessores(professores);

    } catch (erro) {
        console.error("Erro ao carregar professores:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Erro ao carregar os professores.
                </td>
            </tr>
        `;
    }
}

function exibirProfessores(listaProfessores) {
    const tabela = document.getElementById("listaProfessores");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (listaProfessores.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Nenhum professor encontrado.
                </td>
            </tr>
        `;
        return;
    }

    listaProfessores.forEach(professor => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${professor.codProf}</td>
            <td>${professor.nome}</td>
            <td>${professor.cpf}</td>
            <td>${professor.email}</td>
            <td>${professor.data_nascimento}</td>
            <td>${professor.telefone}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    onclick="alterarProfessor(${professor.codProf})"
                >
                    Alterar
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

function filtrarProfessores() {
    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;
    const texto = textoElemento.value.toLowerCase().trim();

    const professoresFiltrados = professores.filter(professor => {
        const valor = professor[campo];

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor).toLowerCase().includes(texto);
    });

    exibirProfessores(professoresFiltrados);
}

const textoFiltro = document.getElementById("textoFiltro");

if (textoFiltro) {
    textoFiltro.addEventListener("input", filtrarProfessores);
}

const campoFiltro = document.getElementById("campoFiltro");

if (campoFiltro) {
    campoFiltro.addEventListener("change", filtrarProfessores);
}

const btnLimparFiltro = document.getElementById("btnLimparFiltro");

if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", function() {
        document.getElementById("textoFiltro").value = "";
        exibirProfessores(professores);
    });
}

carregarProfessores();
carregarProfessorParaAlteracao();
