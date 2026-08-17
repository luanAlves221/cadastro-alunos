from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from mysql.connector import IntegrityError

from backend.database import criar_conexao
from backend.schemas import (
    AlunoCreate,
    AlunoResponse,
    FuncionarioCreate,
    FuncionarioResponse,
    ProfessorCreate,
    ProfessorResponse,
)


app = FastAPI()


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


app.mount(
    "/frontend",
    StaticFiles(directory=FRONTEND_DIR),
    name="frontend"
)


@app.get("/", include_in_schema=False)
def pagina_inicial():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/cadastro-de-aluno", include_in_schema=False)
def pagina_cadastro_aluno():
    return FileResponse(FRONTEND_DIR / "cadastro_aluno.html")


@app.get("/cadastro-de-professor", include_in_schema=False)
def pagina_cadastro_professor():
    return FileResponse(FRONTEND_DIR / "cadastro_professor.html")


@app.get("/cadastro-de-funcionario", include_in_schema=False)
def pagina_cadastro_funcionario():
    return FileResponse(FRONTEND_DIR / "cadastro_funcionario.html")


@app.get("/alunos", response_model=list[AlunoResponse])
def listar_alunos():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM alunos")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    alunos = []

    for registro in registros:
        alunos.append({
            "id": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "curso": registro[5]
        })

    return alunos


@app.post("/alunos", response_model=AlunoResponse)
def cadastrar_aluno(aluno: AlunoCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO alunos
        (nome, cpf, email, data_nascimento, curso)
        VALUES (%s, %s, %s, %s, %s)
    '''

    valores = (
        aluno.nome,
        aluno.cpf,
        aluno.email,
        aluno.data_nascimento,
        aluno.curso
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "id": cursor.lastrowid,
            "nome": aluno.nome,
            "cpf": aluno.cpf,
            "email": aluno.email,
            "data_nascimento": aluno.data_nascimento,
            "curso": aluno.curso
        }

    except IntegrityError as erro:
        conexao.rollback()

        if erro.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="CPF já cadastrado."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()


@app.get("/professores", response_model=list[ProfessorResponse])
def listar_professores():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM professores")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    professores = []

    for registro in registros:
        professores.append({
            "id": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "especialidade": registro[4]
        })

    return professores


@app.post("/professores", response_model=ProfessorResponse)
def cadastrar_professor(professor: ProfessorCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO professores
        (nome, cpf, email, especialidade)
        VALUES (%s, %s, %s, %s)
    '''

    valores = (
        professor.nome,
        professor.cpf,
        professor.email,
        professor.especialidade
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "id": cursor.lastrowid,
            "nome": professor.nome,
            "cpf": professor.cpf,
            "email": professor.email,
            "especialidade": professor.especialidade
        }

    except IntegrityError as erro:
        conexao.rollback()

        if erro.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="CPF já cadastrado."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()


@app.get("/funcionarios", response_model=list[FuncionarioResponse])
def listar_funcionarios():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM funcionarios")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    funcionarios = []

    for registro in registros:
        funcionarios.append({
            "id": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "cargo": registro[4],
            "setor": registro[5]
        })

    return funcionarios


@app.post("/funcionarios", response_model=FuncionarioResponse)
def cadastrar_funcionario(funcionario: FuncionarioCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO funcionarios
        (nome, cpf, email, cargo, setor)
        VALUES (%s, %s, %s, %s, %s)
    '''

    valores = (
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.cargo,
        funcionario.setor
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "id": cursor.lastrowid,
            "nome": funcionario.nome,
            "cpf": funcionario.cpf,
            "email": funcionario.email,
            "cargo": funcionario.cargo,
            "setor": funcionario.setor
        }

    except IntegrityError as erro:
        conexao.rollback()

        if erro.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="CPF já cadastrado."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()