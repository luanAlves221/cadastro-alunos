import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listarAlunos, cadastrarAluno } from "../services/api";

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
    setMensagem("");
    setErro("");
    setSearchParams({ acao: "cadastrar" });
  }

  function fecharFormulario() {
    setFormulario(formularioVazio);
    setSearchParams({});
  }

  async function salvarAluno(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      await cadastrarAluno(formulario);
      setMensagem("Aluno cadastrado com sucesso!");
      setFormulario(formularioVazio);
      setSearchParams({});
      await carregarAlunos();
    } catch (erro) {
      setErro(erro.message || "Não foi possível cadastrar o aluno.");
    } finally {
      setSalvando(false);
    }
  }

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
          <h2>Novo aluno</h2>

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
                {salvando ? "Salvando..." : "Salvar aluno"}
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
              </tr>
            </thead>

            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.codAluno}>
                  <td>{aluno.codAluno}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.email}</td>
                  <td>{String(aluno.data_nascimento).slice(0, 10)}</td>
                  <td>{aluno.telefone}</td>
                  <td>{aluno.ra}</td>
                </tr>
              ))}

              {alunos.length === 0 && (
                <tr>
                  <td colSpan="7">Nenhum aluno cadastrado.</td>
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
