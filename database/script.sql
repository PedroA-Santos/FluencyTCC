-- Active: 1737138520612@@127.0.0.1@3306@fluencytcc
DROP DATABASE IF EXISTS fluencytcc;

CREATE DATABASE fluencytcc
    DEFAULT CHARACTER SET = 'utf8mb4';

USE fluencytcc;

CREATE TABLE generos  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genero VARCHAR(40)
);

CREATE TABLE idiomas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idioma VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE paises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    idioma_nativo_id INT NOT NULL,
    genero_id INT NOT NULL,
    data_nascimento DATE NOT NULL,
    pais_origem_id INT NOT NULL,
    bio TEXT DEFAULT '',
    foto_perfil VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idioma_nativo_id) REFERENCES idiomas(id),
    FOREIGN KEY (genero_id) REFERENCES generos(id),
    FOREIGN KEY (pais_origem_id) REFERENCES paises(id)
);

CREATE TABLE interesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    interesse VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios_idiomas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    idioma_id INT NOT NULL,
    nivel ENUM ('Básico', 'Intermediário', 'Avançado'),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (idioma_id) REFERENCES idiomas(id)
);

CREATE TABLE usuarios_interesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    interesse_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (interesse_id) REFERENCES interesses(id)
);

CREATE TABLE ofensivas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    idioma_id INT NOT NULL,
    dias_seguidos INT DEFAULT 0,
    ultima_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (idioma_id) REFERENCES idiomas(id)
);

CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario1_id INT NOT NULL,
    usuario2_id INT NOT NULL,
    idioma_comum INT NOT NULL,
    status ENUM('pendente', 'aceito', 'rejeitado'),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario1_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario2_id) REFERENCES usuarios(id),
    FOREIGN KEY (idioma_comum) REFERENCES idiomas(id)
);

CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
    FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
);


ALTER TABLE usuarios MODIFY foto_perfil VARCHAR(255);
