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
    TurmaAlunoCreate,
    TurmaAlunoResponse,
    TurmaCreate,
    TurmaProfessorCreate,
    TurmaProfessorResponse,
    TurmaResponse,
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


@app.get("/cadastro-de-turma", include_in_schema=False)
def pagina_cadastro_turma():
    return FileResponse(FRONTEND_DIR / "cadastro_turma.html")


@app.get("/cadastro-de-turma-aluno", include_in_schema=False)
def pagina_cadastro_turma_aluno():
    return FileResponse(FRONTEND_DIR / "cadastro_turmaaluno.html")


@app.get("/cadastro-de-turma-professor", include_in_schema=False)
def pagina_cadastro_turma_professor():
    return FileResponse(FRONTEND_DIR / "cadastro_turmaprofessor.html")


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
            "codAluno": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5],
            "ra": registro[6]
        })

    return alunos


@app.post("/alunos", response_model=AlunoResponse)
def cadastrar_aluno(aluno: AlunoCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO alunos
        (nome, cpf, email, data_nascimento, telefone, ra)
        VALUES (%s, %s, %s, %s, %s, %s)
    '''

    valores = (
        aluno.nome,
        aluno.cpf,
        aluno.email,
        aluno.data_nascimento,
        aluno.telefone,
        aluno.ra
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codAluno": cursor.lastrowid,
            "nome": aluno.nome,
            "cpf": aluno.cpf,
            "email": aluno.email,
            "data_nascimento": aluno.data_nascimento,
            "telefone": aluno.telefone,
            "ra": aluno.ra
        }

    except IntegrityError as erro:
        conexao.rollback()

        if erro.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="CPF ou RA já cadastrado."
            )

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()


@app.put("/alunos/{codAluno}", response_model=AlunoResponse)
def alterar_aluno(codAluno: int, aluno: AlunoCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    try:
        cursor.execute("SELECT codAluno FROM alunos WHERE codAluno = %s", (codAluno,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Aluno não encontrado."
            )

        sql = """
            UPDATE alunos
            SET
                nome = %s,
                cpf = %s,
                email = %s,
                data_nascimento = %s,
                telefone = %s,
                ra = %s
            WHERE codAluno = %s
        """

        valores = (
            aluno.nome,
            aluno.cpf,
            aluno.email,
            aluno.data_nascimento,
            aluno.telefone,
            aluno.ra,
            codAluno
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codAluno": codAluno,
            "nome": aluno.nome,
            "cpf": aluno.cpf,
            "email": aluno.email,
            "data_nascimento": aluno.data_nascimento,
            "telefone": aluno.telefone,
            "ra": aluno.ra
        }

    except HTTPException:
        raise

    except IntegrityError as erro:
        conexao.rollback()

        if erro.errno == 1062:
            raise HTTPException(
                status_code=409,
                detail="CPF ou RA já cadastrado."
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
            "codProf": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5]
        })

    return professores


@app.post("/professores", response_model=ProfessorResponse)
def cadastrar_professor(professor: ProfessorCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO professores
        (nome, cpf, email, data_nascimento, telefone)
        VALUES (%s, %s, %s, %s, %s)
    '''

    valores = (
        professor.nome,
        professor.cpf,
        professor.email,
        professor.data_nascimento,
        professor.telefone
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codProf": cursor.lastrowid,
            "nome": professor.nome,
            "cpf": professor.cpf,
            "email": professor.email,
            "data_nascimento": professor.data_nascimento,
            "telefone": professor.telefone
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


@app.put("/professores/{codProf}", response_model=ProfessorResponse)
def alterar_professor(codProf: int, professor: ProfessorCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    try:
        cursor.execute("SELECT codProf FROM professores WHERE codProf = %s", (codProf,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Professor não encontrado."
            )

        sql = """
            UPDATE professores
            SET
                nome = %s,
                cpf = %s,
                email = %s,
                data_nascimento = %s,
                telefone = %s
            WHERE codProf = %s
        """

        valores = (
            professor.nome,
            professor.cpf,
            professor.email,
            professor.data_nascimento,
            professor.telefone,
            codProf
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codProf": codProf,
            "nome": professor.nome,
            "cpf": professor.cpf,
            "email": professor.email,
            "data_nascimento": professor.data_nascimento,
            "telefone": professor.telefone
        }

    except HTTPException:
        raise

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
            "codFunc": registro[0],
            "nome": registro[1],
            "cpf": registro[2],
            "email": registro[3],
            "data_nascimento": registro[4],
            "telefone": registro[5]
        })

    return funcionarios


@app.post("/funcionarios", response_model=FuncionarioResponse)
def cadastrar_funcionario(funcionario: FuncionarioCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO funcionarios
        (nome, cpf, email, data_nascimento, telefone)
        VALUES (%s, %s, %s, %s, %s)
    '''

    valores = (
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.data_nascimento,
        funcionario.telefone
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codFunc": cursor.lastrowid,
            "nome": funcionario.nome,
            "cpf": funcionario.cpf,
            "email": funcionario.email,
            "data_nascimento": funcionario.data_nascimento,
            "telefone": funcionario.telefone
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


@app.put("/funcionarios/{codFunc}", response_model=FuncionarioResponse)
def alterar_funcionario(codFunc: int, funcionario: FuncionarioCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    try:
        cursor.execute("SELECT codFunc FROM funcionarios WHERE codFunc = %s", (codFunc,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Funcionário não encontrado."
            )

        sql = """
            UPDATE funcionarios
            SET
                nome = %s,
                cpf = %s,
                email = %s,
                data_nascimento = %s,
                telefone = %s
            WHERE codFunc = %s
        """

        valores = (
            funcionario.nome,
            funcionario.cpf,
            funcionario.email,
            funcionario.data_nascimento,
            funcionario.telefone,
            codFunc
        )

        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codFunc": codFunc,
            "nome": funcionario.nome,
            "cpf": funcionario.cpf,
            "email": funcionario.email,
            "data_nascimento": funcionario.data_nascimento,
            "telefone": funcionario.telefone
        }

    except HTTPException:
        raise

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


@app.get("/turmas", response_model=list[TurmaResponse])
def listar_turmas():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM turma")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    turmas = []

    for registro in registros:
        turmas.append({
            "codTurma": registro[0],
            "curso": registro[1],
            "modulo": registro[2],
            "ano": registro[3]
        })

    return turmas


@app.post("/turmas", response_model=TurmaResponse)
def cadastrar_turma(turma: TurmaCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO turma
        (curso, modulo, ano)
        VALUES (%s, %s, %s)
    '''

    valores = (
        turma.curso,
        turma.modulo,
        turma.ano
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codTurma": cursor.lastrowid,
            "curso": turma.curso,
            "modulo": turma.modulo,
            "ano": turma.ano
        }

    except IntegrityError as erro:
        conexao.rollback()

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()


@app.get("/turma-alunos", response_model=list[TurmaAlunoResponse])
def listar_turma_alunos():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM turmaaluno")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    turma_alunos = []

    for registro in registros:
        turma_alunos.append({
            "codTurmaAluno": registro[0],
            "codTurma": registro[1],
            "codAluno": registro[2]
        })

    return turma_alunos


@app.post("/turma-alunos", response_model=TurmaAlunoResponse)
def cadastrar_turma_aluno(turma_aluno: TurmaAlunoCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO turmaaluno
        (codTurma, codAluno)
        VALUES (%s, %s)
    '''

    valores = (
        turma_aluno.codTurma,
        turma_aluno.codAluno
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codTurmaAluno": cursor.lastrowid,
            "codTurma": turma_aluno.codTurma,
            "codAluno": turma_aluno.codAluno
        }

    except IntegrityError as erro:
        conexao.rollback()

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()


@app.get("/turma-professores", response_model=list[TurmaProfessorResponse])
def listar_turma_professores():
    conexao = criar_conexao()
    cursor = conexao.cursor()

    cursor.execute("SELECT * FROM turmaprofessor")
    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    turma_professores = []

    for registro in registros:
        turma_professores.append({
            "codTurmaProfessor": registro[0],
            "codTurma": registro[1],
            "codProf": registro[2]
        })

    return turma_professores


@app.post("/turma-professores", response_model=TurmaProfessorResponse)
def cadastrar_turma_professor(turma_professor: TurmaProfessorCreate):
    conexao = criar_conexao()
    cursor = conexao.cursor()

    sql = '''
        INSERT INTO turmaprofessor
        (codTurma, codProf)
        VALUES (%s, %s)
    '''

    valores = (
        turma_professor.codTurma,
        turma_professor.codProf
    )

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return {
            "codTurmaProfessor": cursor.lastrowid,
            "codTurma": turma_professor.codTurma,
            "codProf": turma_professor.codProf
        }

    except IntegrityError as erro:
        conexao.rollback()

        raise HTTPException(
            status_code=500,
            detail="Erro de integridade no banco de dados."
        )

    finally:
        cursor.close()
        conexao.close()