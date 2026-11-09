import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  listarAlunos,
  cadastrarAluno,
  alterarAluno,
  excluirAluno,
} from "../services/api";

const formularioVazio = {
  nome: "",
  cpf: "",
  email: "",
  data_nascimento: "",
  telefone: "",
  ra: "",
};

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [campoFiltro, setCampoFiltro] = useState("nome");
  const [textoFiltro, setTextoFiltro] = useState("");
  const [formulario, setFormulario] = useState(formularioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const mostrarFormulario = searchParams.get("acao") === "cadastrar";

  async function carregarAlunos() {
    setErro("");

    try {
      const dados = await listarAlunos();
      setAlunos(dados);
    } catch (erro) {
      setErro(erro.message || "Não foi possível carregar os alunos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  function abrirFormulario() {
    setFormulario(formularioVazio);
    setAlunoEditando(null);
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  function fecharFormulario() {
    setFormulario(formularioVazio);
    setAlunoEditando(null);
    setSearchParams({});
  }

  function prepararEdicao(aluno) {
    setFormulario({
      nome: aluno.nome ?? "",
      cpf: aluno.cpf ?? "",
      email: aluno.email ?? "",
      data_nascimento: aluno.data_nascimento
        ? String(aluno.data_nascimento).slice(0, 10)
        : "",
      telefone: aluno.telefone ?? "",
      ra: aluno.ra ?? "",
    });

    setAlunoEditando(aluno.codAluno);
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  async function salvarAluno(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      if (alunoEditando !== null) {
        await alterarAluno(alunoEditando, formulario);
        setMensagem("Aluno alterado com sucesso!");
      } else {
        await cadastrarAluno(formulario);
        setMensagem("Aluno cadastrado com sucesso!");
      }

      setFormulario(formularioVazio);
      setAlunoEditando(null);
      setSearchParams({});
      await carregarAlunos();
    } catch (erro) {
      setErro(erro.message || "Não foi possível salvar o aluno.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerAluno(codAluno) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este aluno? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await excluirAluno(codAluno);
      setMensagem("Aluno excluído com sucesso!");
      await carregarAlunos();
    } catch (erro) {
      setErro(erro.message || "Não foi possível excluir o aluno.");
    }
  }

  const alunosFiltrados = alunos.filter((aluno) => {
    const valor = aluno[campoFiltro];

    if (valor === null || valor === undefined) {
      return false;
    }

    return String(valor)
      .toLowerCase()
      .includes(textoFiltro.trim().toLowerCase());
  });

  return (
    <main className="pagina">
      <div className="topo-pagina">
        <div>
          <h1>Cadastro de Alunos</h1>
          <p>Consulte os alunos cadastrados ou realize um novo cadastro.</p>
        </div>

        <Link className="botao botao-secundario" to="/">
          Voltar ao início
        </Link>
      </div>

      {!mostrarFormulario && (
        <button
          className="botao botao-principal"
          type="button"
          onClick={abrirFormulario}
        >
          Cadastrar aluno
        </button>
      )}

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {mostrarFormulario && (
        <section className="formulario">
          <h2>{alunoEditando !== null ? "Alterar aluno" : "Novo aluno"}</h2>

          <form onSubmit={salvarAluno}>
            <div className="campos">
              <label>
                Nome
                <input
                  name="nome"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  maxLength={100}
                  required
                />
              </label>

              <label>
                CPF
                <input
                  name="cpf"
                  value={formulario.cpf}
                  onChange={atualizarCampo}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </label>

              <label>
                E-mail
                <input
                  name="email"
                  type="email"
                  value={formulario.email}
                  onChange={atualizarCampo}
                  maxLength={150}
                  required
                />
              </label>

              <label>
                Data de nascimento
                <input
                  name="data_nascimento"
                  type="date"
                  value={formulario.data_nascimento}
                  onChange={atualizarCampo}
                  required
                />
              </label>

              <label>
                Telefone
                <input
                  name="telefone"
                  value={formulario.telefone}
                  onChange={atualizarCampo}
                  placeholder="(00) 00000-0000"
                  maxLength={20}
                  required
                />
              </label>

              <label>
                RA
                <input
                  name="ra"
                  value={formulario.ra}
                  onChange={atualizarCampo}
                  maxLength={10}
                  required
                />
              </label>
            </div>

            <div className="acoes-formulario">
              <button
                className="botao botao-principal"
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : alunoEditando !== null
                    ? "Salvar alterações"
                    : "Cadastrar aluno"}
              </button>

              <button
                className="botao botao-cancelar"
                type="button"
                onClick={fecharFormulario}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="filtros">
        <label>
          Filtrar por
          <select
            value={campoFiltro}
            onChange={(evento) => setCampoFiltro(evento.target.value)}
          >
            <option value="codAluno">Código</option>
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="email">E-mail</option>
            <option value="data_nascimento">Data de nascimento</option>
            <option value="telefone">Telefone</option>
            <option value="ra">RA</option>
          </select>
        </label>

        <label>
          Texto para buscar
          <input
            type="text"
            value={textoFiltro}
            onChange={(evento) => setTextoFiltro(evento.target.value)}
            placeholder="Digite o que deseja encontrar"
          />
        </label>

        <button
          className="botao botao-principal"
          type="button"
          onClick={() => setTextoFiltro((texto) => texto.trim())}
        >
          Filtrar
        </button>

        <button
          className="botao botao-secundario"
          type="button"
          onClick={() => {
            setCampoFiltro("nome");
            setTextoFiltro("");
          }}
        >
          Limpar
        </button>
      </section>

      <h2>Alunos cadastrados</h2>

      {carregando ? (
        <p>Carregando alunos...</p>
      ) : (
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Data de nascimento</th>
                <th>Telefone</th>
                <th>RA</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {alunosFiltrados.map((aluno) => (
                <tr key={aluno.codAluno}>
                  <td>{aluno.codAluno}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.email}</td>
                  <td>{String(aluno.data_nascimento).slice(0, 10)}</td>
                  <td>{aluno.telefone}</td>
                  <td>{aluno.ra}</td>
                  <td>
                    <div className="acoes-tabela">
                      <button
                        type="button"
                        className="botao botao-editar"
                        onClick={() => prepararEdicao(aluno)}
                      >
                        Alterar
                      </button>

                      <button
                        type="button"
                        className="botao botao-excluir"
                        onClick={() => removerAluno(aluno.codAluno)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {alunosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8">
                    {alunos.length === 0
                      ? "Nenhum aluno cadastrado."
                      : "Nenhum aluno encontrado para esse filtro."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Alunos;
