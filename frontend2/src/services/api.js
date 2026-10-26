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

export async function listarProfessores() {
  const resposta = await fetch(`${API_URL}/professores`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível carregar os professores."
    );
  }

  return dados;
}

export async function cadastrarProfessor(professor) {
  const resposta = await fetch(`${API_URL}/professores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(professor),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível cadastrar o professor. Confira os dados informados."
    );
  }

  return dados;
}

export async function listarFuncionarios() {
  const resposta = await fetch(`${API_URL}/funcionarios`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível carregar os funcionários."
    );
  }

  return dados;
}

export async function cadastrarFuncionario(funcionario) {
  const resposta = await fetch(`${API_URL}/funcionarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(funcionario),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      typeof dados.detail === "string"
        ? dados.detail
        : "Não foi possível cadastrar o funcionário. Confira os dados informados."
    );
  }

  return dados;
}
