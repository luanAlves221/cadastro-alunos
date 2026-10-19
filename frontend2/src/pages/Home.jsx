import { Link } from "react-router-dom";

function Home() {
  const modulos = [
    {
      titulo: "Alunos",
      descricao: "Consulte os alunos cadastrados ou realize um novo cadastro.",
      rota: "/alunos",
      rotaCadastro: "/alunos?acao=cadastrar",
      textoCadastro: "Cadastrar aluno",
    },
    {
      titulo: "Professores",
      descricao: "Consulte os professores cadastrados ou realize um novo cadastro.",
      rota: "/professores",
      rotaCadastro: "/professores?acao=cadastrar",
      textoCadastro: "Cadastrar professor",
    },
    {
      titulo: "Funcionários",
      descricao: "Consulte os funcionários cadastrados ou realize um novo cadastro.",
      rota: "/funcionarios",
      rotaCadastro: "/funcionarios?acao=cadastrar",
      textoCadastro: "Cadastrar funcionário",
    },
  ];

  return (
    <main className="home">
      <h1>Sistema de Gestão Escolar</h1>
      <p className="subtitulo">
        Gerencie alunos, professores e funcionários de forma simples e organizada.
      </p>

      <section className="cards">
        {modulos.map((modulo) => (
          <article className="card" key={modulo.titulo}>
            <h2>{modulo.titulo}</h2>
            <p>{modulo.descricao}</p>

            <div className="botoes-card">
              <Link className="botao botao-principal" to={modulo.rota}>
                Ver {modulo.titulo.toLowerCase()}
              </Link>

              <Link className="botao botao-secundario" to={modulo.rotaCadastro}>
                {modulo.textoCadastro}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Home;
