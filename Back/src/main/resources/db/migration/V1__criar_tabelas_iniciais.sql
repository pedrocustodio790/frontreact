-- Tabela de Componentes
CREATE TABLE componente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo_patrimonio VARCHAR(255) UNIQUE,
    quantidade INT NOT NULL,
    categoria VARCHAR(100),
    localizacao VARCHAR(100),
    observacoes TEXT
);

-- Tabela de Histórico de Movimentações
CREATE TABLE historico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    componente_id BIGINT,
    tipo VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    usuario VARCHAR(100),
    data_hora DATETIME NOT NULL,
    codigo_movimentacao VARCHAR(255),
    FOREIGN KEY (componente_id) REFERENCES componente(id)
);

-- Tabela de Utilizadores
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tabela de Regras (Roles)
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Junção para Utilizadores e Regras (Many-to-Many)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Inserir as regras padrão
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_USER');