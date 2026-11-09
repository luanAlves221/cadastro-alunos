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

export async function alterarAluno(codAluno, aluno) {
  const resposta = await fetch(`${API_URL}/alunos/${codAluno}`, {
    method: "PUT",
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
        : "Não foi possível alterar o aluno."
    );
  }

  return dados;
}

export async function excluirAluno(codAluno) {
  const resposta = await fetch(`${API_URL}/alunos/${codAluno}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    let mensagem = "Não foi possível excluir o aluno.";

    try {
      const dados = await resposta.json();

      if (typeof dados.detail === "string") {
        mensagem = dados.detail;
      }
    } catch {
      // Ignora erro se não houver corpo JSON
    }

    throw new Error(mensagem);
  }

  if (resposta.status === 204) {
    return;
  }

  return resposta.json();
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

export async function alterarProfessor(codProf, professor) {
  const resposta = await fetch(`${API_URL}/professores/${codProf}`, {
    method: "PUT",
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
        : "Não foi possível alterar o professor."
    );
  }

  return dados;
}

export async function excluirProfessor(codProf) {
  const resposta = await fetch(`${API_URL}/professores/${codProf}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    let mensagem = "Não foi possível excluir o professor.";

    try {
      const dados = await resposta.json();

      if (typeof dados.detail === "string") {
        mensagem = dados.detail;
      }
    } catch {
      // Ignora erro se não houver corpo JSON
    }

    throw new Error(mensagem);
  }

  if (resposta.status === 204) {
    return;
  }

  return resposta.json();
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

export async function alterarFuncionario(codFunc, funcionario) {
  const resposta = await fetch(`${API_URL}/funcionarios/${codFunc}`, {
    method: "PUT",
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
        : "Não foi possível alterar o funcionário."
    );
  }

  return dados;
}

export async function excluirFuncionario(codFunc) {
  const resposta = await fetch(`${API_URL}/funcionarios/${codFunc}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    let mensagem = "Não foi possível excluir o funcionário.";

    try {
      const dados = await resposta.json();

      if (typeof dados.detail === "string") {
        mensagem = dados.detail;
      }
    } catch {
      // Ignora erro se não houver corpo JSON
    }

    throw new Error(mensagem);
  }

  if (resposta.status === 204) {
    return;
  }

  return resposta.json();
}
