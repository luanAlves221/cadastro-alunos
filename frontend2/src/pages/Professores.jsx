import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  listarProfessores,
  cadastrarProfessor,
  alterarProfessor,
  excluirProfessor,
} from "../services/api";

const formularioVazio = {
  nome: "",
  cpf: "",
  email: "",
  data_nascimento: "",
  telefone: "",
};

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [professorEditando, setProfessorEditando] = useState(null);
  const [campoFiltro, setCampoFiltro] = useState("nome");
  const [textoFiltro, setTextoFiltro] = useState("");
  const [formulario, setFormulario] = useState(formularioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const mostrarFormulario = searchParams.get("acao") === "cadastrar";

  async function carregarProfessores() {
    setErro("");

    try {
      const dados = await listarProfessores();
      setProfessores(dados);
    } catch (erro) {
      setErro(erro.message || "Não foi possível carregar os professores.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProfessores();
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
    setProfessorEditando(null);
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  function fecharFormulario() {
    setFormulario(formularioVazio);
    setProfessorEditando(null);
    setSearchParams({});
  }

  function prepararEdicao(prof) {
    setFormulario({
      nome: prof.nome ?? "",
      cpf: prof.cpf ?? "",
      email: prof.email ?? "",
      data_nascimento: prof.data_nascimento
        ? String(prof.data_nascimento).slice(0, 10)
        : "",
      telefone: prof.telefone ?? "",
    });

    setProfessorEditando(prof.codProf);
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  async function salvarProfessor(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      if (professorEditando !== null) {
        await alterarProfessor(professorEditando, formulario);
        setMensagem("Professor alterado com sucesso!");
      } else {
        await cadastrarProfessor(formulario);
        setMensagem("Professor cadastrado com sucesso!");
      }

      setFormulario(formularioVazio);
      setProfessorEditando(null);
      setSearchParams({});
      await carregarProfessores();
    } catch (erro) {
      setErro(erro.message || "Não foi possível salvar o professor.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerProfessor(codProf) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este professor? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await excluirProfessor(codProf);
      setMensagem("Professor excluído com sucesso!");
      await carregarProfessores();
    } catch (erro) {
      setErro(erro.message || "Não foi possível excluir o professor.");
    }
  }

  const professoresFiltrados = professores.filter((prof) => {
    const valor = prof[campoFiltro];

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
          <h1>Cadastro de Professores</h1>
          <p>Consulte os professores cadastrados ou realize um novo cadastro.</p>
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
          Cadastrar professor
        </button>
      )}

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {mostrarFormulario && (
        <section className="formulario">
          <h2>{professorEditando !== null ? "Alterar professor" : "Novo professor"}</h2>

          <form onSubmit={salvarProfessor}>
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
            </div>

            <div className="acoes-formulario">
              <button
                className="botao botao-principal"
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : professorEditando !== null
                    ? "Salvar alterações"
                    : "Cadastrar professor"}
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
            <option value="codProf">Código</option>
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="email">E-mail</option>
            <option value="data_nascimento">Data de nascimento</option>
            <option value="telefone">Telefone</option>
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

      <h2>Professores cadastrados</h2>

      {carregando ? (
        <p>Carregando professores...</p>
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
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {professoresFiltrados.map((prof) => (
                <tr key={prof.codProf}>
                  <td>{prof.codProf}</td>
                  <td>{prof.nome}</td>
                  <td>{prof.cpf}</td>
                  <td>{prof.email}</td>
                  <td>{String(prof.data_nascimento).slice(0, 10)}</td>
                  <td>{prof.telefone}</td>
                  <td>
                    <div className="acoes-tabela">
                      <button
                        type="button"
                        className="botao botao-editar"
                        onClick={() => prepararEdicao(prof)}
                      >
                        Alterar
                      </button>

                      <button
                        type="button"
                        className="botao botao-excluir"
                        onClick={() => removerProfessor(prof.codProf)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {professoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7">
                    {professores.length === 0
                      ? "Nenhum professor cadastrado."
                      : "Nenhum professor encontrado para esse filtro."}
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

export default Professores;
