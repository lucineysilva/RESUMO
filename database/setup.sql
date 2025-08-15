-- Banco de dados para o sistema de resumos
-- Execute este script no MySQL

CREATE DATABASE IF NOT EXISTS resumos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE resumos_db;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de highlights/marcações
CREATE TABLE highlights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    start_offset INT NOT NULL,
    end_offset INT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_file (user_id, file_path)
);

-- Tabela de notas
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    start_offset INT NOT NULL,
    end_offset INT NOT NULL,
    text TEXT NOT NULL,
    note_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_file (user_id, file_path)
);

-- Inserir um usuário de teste
INSERT INTO users (email, password_hash, name) VALUES 
('teste@teste.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuário Teste');
-- Senha: password

-- Verificar se as tabelas foram criadas
SHOW TABLES;
information_schema