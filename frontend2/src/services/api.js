const API_URL = "http://127.0.0.1:8000";

export async function listarAlunos() {
  const resposta = await fetch(`${API_URL}/alunos`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível carregar os alunos."
    );
  }

  return dados;
}

export async function cadastrarAluno(aluno) {
  const resposta = await fetch(`${API_URL}/alunos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aluno),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível cadastrar o aluno. Confira os dados informados."
    );
  }

  return dados;
}
