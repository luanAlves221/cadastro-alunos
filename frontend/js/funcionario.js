let funcionarios = [];

const parametros = new URLSearchParams(window.location.search);
const codFunc = parametros.get("codFunc");

const formulario = document.getElementById("form-funcionario");
const mensagem = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        mensagem.textContent = "";

        const btnSalvar = document.getElementById("btnSalvar");
        if (btnSalvar) {
            btnSalvar.disabled = true;
        }

        const funcionario = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            email: document.getElementById("email").value,
            data_nascimento: document.getElementById("data_nascimento").value,
            telefone: document.getElementById("telefone").value
        };

        try {
            let resposta;

            if (codFunc) {
                resposta = await fetch(`/funcionarios/${codFunc}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(funcionario)
                });
            } else {
                resposta = await fetch("/funcionarios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(funcionario)
                });
            }

            const resultado = await resposta.json();

            if (resposta.ok) {
                if (codFunc) {
                    mensagem.textContent = "Funcionário alterado com sucesso!";
                    setTimeout(() => {
                        window.location.href = "/frontend/funcionarios.html";
                    }, 1200);
                } else {
                    mensagem.textContent = "Funcionário cadastrado com sucesso!";
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

function alterarFuncionario(codFunc) {
    window.location.href = `/cadastro-de-funcionario?codFunc=${codFunc}`;
}

async function carregarFuncionarioParaAlteracao() {
    if (!codFunc || !formulario) {
        return;
    }

    try {
        const resposta = await fetch("/funcionarios");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionários.");
        }

        const listaFuncionarios = await resposta.json();

        const funcionario = listaFuncionarios.find(
            item => item.codFunc == codFunc
        );

        if (!funcionario) {
            mensagem.textContent = "Funcionário não encontrado.";
            return;
        }

        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("cpf").value = funcionario.cpf;
        document.getElementById("email").value = funcionario.email;
        document.getElementById("data_nascimento").value = funcionario.data_nascimento;
        document.getElementById("telefone").value = funcionario.telefone;

        const titulo = document.getElementById("tituloFormulario");
        if (titulo) {
            titulo.textContent = "Alterar Funcionário";
        }

        const btnSalvar = document.getElementById("btnSalvar");
        if (btnSalvar) {
            btnSalvar.textContent = "Salvar alterações";
        }

    } catch (erro) {
        console.error("Erro ao carregar funcionário:", erro);
        mensagem.textContent = "Não foi possível carregar os dados do funcionário.";
    }
}

async function carregarFuncionarios() {
    const tabela = document.getElementById("listaFuncionarios");

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch("/funcionarios");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar funcionários.");
        }

        funcionarios = await resposta.json();

        exibirFuncionarios(funcionarios);

    } catch (erro) {
        console.error("Erro ao carregar funcionários:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Erro ao carregar os funcionários.
                </td>
            </tr>
        `;
    }
}

function exibirFuncionarios(listaFuncionarios) {
    const tabela = document.getElementById("listaFuncionarios");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";

    if (listaFuncionarios.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Nenhum funcionário encontrado.
                </td>
            </tr>
        `;
        return;
    }

    listaFuncionarios.forEach(funcionario => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${funcionario.codFunc}</td>
            <td>${funcionario.nome}</td>
            <td>${funcionario.cpf}</td>
            <td>${funcionario.email}</td>
            <td>${funcionario.data_nascimento}</td>
            <td>${funcionario.telefone}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm me-1"
                    onclick="alterarFuncionario(${funcionario.codFunc})"
                >
                    Alterar
                </button>
                <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onclick="excluirFuncionario(${funcionario.codFunc}, '${funcionario.nome.replace(/'/g, "\\'")}')"
                >
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

async function excluirFuncionario(codFunc, nomeFunc) {
    const confirmar = confirm(`Deseja realmente excluir o funcionário ${nomeFunc}?`);

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/funcionarios/${codFunc}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Funcionário excluído com sucesso!");
            carregarFuncionarios();
        } else {
            alert("Erro: " + obterMensagemErro(resultado));
            console.error("Erro da API:", resultado);
        }

    } catch (erro) {
        alert("Não foi possível conectar ao servidor.");
        console.error("Erro de conexão:", erro);
    }
}

function filtrarFuncionarios() {
    const campoElemento = document.getElementById("campoFiltro");
    const textoElemento = document.getElementById("textoFiltro");

    if (!campoElemento || !textoElemento) {
        return;
    }

    const campo = campoElemento.value;
    const texto = textoElemento.value.toLowerCase().trim();

    const funcionariosFiltrados = funcionarios.filter(funcionario => {
        const valor = funcionario[campo];

        if (valor === null || valor === undefined) {
            return false;
        }

        return String(valor).toLowerCase().includes(texto);
    });

    exibirFuncionarios(funcionariosFiltrados);
}

const textoFiltro = document.getElementById("textoFiltro");

if (textoFiltro) {
    textoFiltro.addEventListener("input", filtrarFuncionarios);
}

const campoFiltro = document.getElementById("campoFiltro");

if (campoFiltro) {
    campoFiltro.addEventListener("change", filtrarFuncionarios);
}

const btnLimparFiltro = document.getElementById("btnLimparFiltro");

if (btnLimparFiltro) {
    btnLimparFiltro.addEventListener("click", function() {
        document.getElementById("textoFiltro").value = "";
        exibirFuncionarios(funcionarios);
    });
}

carregarFuncionarios();
carregarFuncionarioParaAlteracao();
