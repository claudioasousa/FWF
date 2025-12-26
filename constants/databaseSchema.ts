
export const DATABASE_SCHEMA_SQL = `-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - GESTÃO DE CURSOS
-- Compatível com PostgreSQL / Supabase

-- 1. TIPOS ENUMERADOS (DEFINIÇÕES DE REGRAS)
CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERATOR');
CREATE TYPE student_status AS ENUM ('CURSANDO', 'APROVADO', 'REPROVADO', 'DESISTENTE');
CREATE TYPE course_period AS ENUM ('Manhã', 'Tarde', 'Noite');
CREATE TYPE course_status AS ENUM ('Ativo', 'Inativo', 'Concluído');

-- 2. TABELA DE PARCEIROS (PATROCINADORES)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    responsible TEXT NOT NULL,
    contact TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PROFESSORES
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contact TEXT NOT NULL,
    specialization TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CURSOS
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    workload INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period course_period NOT NULL,
    location TEXT NOT NULL,
    status course_status DEFAULT 'Ativo',
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RELAÇÃO CURSO x PROFESSOR (Muitos para Muitos)
CREATE TABLE course_teachers (
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, teacher_id)
);

-- 6. TABELA DE ALUNOS
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    contact TEXT NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT NOT NULL,
    status student_status DEFAULT 'CURSANDO',
    class CHAR(1), -- Letras de A a H
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE USUÁRIOS DO SISTEMA
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role DEFAULT 'OPERATOR',
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CARGA INICIAL DE USUÁRIOS (ADMINS PADRÃO)
INSERT INTO users (name, username, password, role) 
VALUES 
('Claudio A. Sousa', 'claudioasousa', 'cas661010', 'ADMIN'),
('Administrador', 'admin', 'admin', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- COMENTÁRIOS DE REGRAS DE NEGÓCIO:
-- - Um aluno só pode ser matriculado em cursos de turnos diferentes.
-- - Status online é atualizado no login/logout da aplicação.
`;
