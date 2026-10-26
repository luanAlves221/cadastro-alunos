import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listarFuncionarios, cadastrarFuncionario } from "../services/api";

const formularioVazio = {
  nome: "",
  cpf: "",
  email: "",
  data_nascimento: "",
  telefone: "",
};

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [formulario, setFormulario] = useState(formularioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const mostrarFormulario = searchParams.get("acao") === "cadastrar";

  async function carregarFuncionarios() {
    setErro("");

    try {
      const dados = await listarFuncionarios();
      setFuncionarios(dados);
    } catch (erro) {
      setErro(erro.message || "Não foi possível carregar os funcionários.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
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
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  function fecharFormulario() {
    setFormulario(formularioVazio);
    setSearchParams({});
  }

  async function salvarFuncionario(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      await cadastrarFuncionario(formulario);
      setMensagem("Funcionário cadastrado com sucesso!");
      setFormulario(formularioVazio);
      setSearchParams({});
      await carregarFuncionarios();
    } catch (erro) {
      setErro(erro.message || "Não foi possível cadastrar o funcionário.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="pagina">
      <div className="topo-pagina">
        <div>
          <h1>Cadastro de Funcionários</h1>
          <p>Consulte os funcionários cadastrados ou realize um novo cadastro.</p>
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
          Cadastrar funcionário
        </button>
      )}

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {mostrarFormulario && (
        <section className="formulario">
          <h2>Novo funcionário</h2>

          <form onSubmit={salvarFuncionario}>
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
                {salvando ? "Salvando..." : "Salvar funcionário"}
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

      <h2>Funcionários cadastrados</h2>

      {carregando ? (
        <p>Carregando funcionários...</p>
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
              </tr>
            </thead>

            <tbody>
              {funcionarios.map((func) => (
                <tr key={func.codFunc}>
                  <td>{func.codFunc}</td>
                  <td>{func.nome}</td>
                  <td>{func.cpf}</td>
                  <td>{func.email}</td>
                  <td>{String(func.data_nascimento).slice(0, 10)}</td>
                  <td>{func.telefone}</td>
                </tr>
              ))}

              {funcionarios.length === 0 && (
                <tr>
                  <td colSpan="6">Nenhum funcionário cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Funcionarios;
