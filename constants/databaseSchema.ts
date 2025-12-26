
export const DATABASE_SCHEMA_SQL = `-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Cole este código no SQL Editor do seu projeto Supabase

-- Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Usuários (Gestão de Acesso)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'OPERATOR' -- ADMIN ou OPERATOR
);

-- 2. Tabela de Professores
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    contact TEXT,
    specialization TEXT
);

-- 3. Tabela de Parceiros (Patrocinadores)
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    companyName TEXT NOT NULL,
    responsible TEXT,
    contact TEXT,
    address TEXT
);

-- 4. Tabela de Cursos
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    workload INTEGER DEFAULT 0,
    startDate DATE,
    endDate DATE,
    startTime TIME,
    endTime TIME,
    period TEXT, -- Manhã, Tarde, Noite
    location TEXT,
    partnerId UUID REFERENCES partners(id) ON DELETE SET NULL,
    teacherIds TEXT[], -- Array de IDs de professores
    status TEXT DEFAULT 'Ativo'
);

-- 5. Tabela de Alunos (Estudantes)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT,
    contact TEXT,
    birthDate DATE,
    address TEXT,
    courseId UUID REFERENCES courses(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'CURSANDO', -- CURSANDO, APROVADO, REPROVADO, DESISTENTE
    class TEXT -- Letras de A até H
);

-- Inserir usuário administrador inicial
INSERT INTO users (name, username, password, role)
VALUES ('Claudio A. Sousa', 'claudioasousa', 'cas661010', 'ADMIN')
ON CONFLICT (username) DO NOTHING;`;
