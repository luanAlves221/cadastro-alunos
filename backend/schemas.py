from datetime import date

from pydantic import BaseModel, EmailStr


class AlunoCreate(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str
    ra: str


class AlunoResponse(BaseModel):
    codAluno: int
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str
    ra: str


class ProfessorCreate(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str


class ProfessorResponse(BaseModel):
    codProf: int
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str


class FuncionarioCreate(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str


class FuncionarioResponse(BaseModel):
    codFunc: int
    nome: str
    cpf: str
    email: EmailStr
    data_nascimento: date
    telefone: str


class TurmaCreate(BaseModel):
    curso: str
    modulo: str
    ano: date


class TurmaResponse(BaseModel):
    codTurma: int
    curso: str
    modulo: str
    ano: date


class TurmaAlunoCreate(BaseModel):
    codTurma: int
    codAluno: int


class TurmaAlunoResponse(BaseModel):
    codTurmaAluno: int
    codTurma: int
    codAluno: int


class TurmaProfessorCreate(BaseModel):
    codTurma: int
    codProf: int


class TurmaProfessorResponse(BaseModel):
    codTurmaProfessor: int
    codTurma: int
    codProf: int