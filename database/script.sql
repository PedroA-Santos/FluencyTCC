-- Active: 1737138520612@@127.0.0.1@3306@fluencytcc
drop DATABASE fluencytcc;

CREATE DATABASE fluencytcc
    DEFAULT CHARACTER SET = 'utf8mb4';

use fluencytcc;

CREATE TABLE generos  (
    id int AUTO_INCREMENT PRIMARY KEY,
    genero VARCHAR(40)
);

CREATE Table idiomas (
    id int AUTO_INCREMENT PRIMARY KEY,
    idioma VARCHAR(50) UNIQUE not NULL
);

CREATE TABLE usuarios (
    id int AUTO_INCREMENT PRIMARY key,
    username VARCHAR(100) not null,
    email VARCHAR(100) UNIQUE not null,
    senha VARCHAR(255) not null,
    idioma_nativo_id int not null,
    genero_id int not null,
    bio text DEFAULT '',
    foto_perfil VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (idioma_nativo_id) REFERENCES idiomas(id),
    Foreign Key (genero_id) REFERENCES generos(id)
);


CREATE Table interesses (
    id int AUTO_INCREMENT PRIMARY KEY,
    interesse VARCHAR(50) UNIQUE not null
);

CREATE TABLE usuarios_idiomas (
    id int AUTO_INCREMENT PRIMARY KEY,
    usuario_id int NOT NULL,
    idioma_id int not null,
    nivel ENUM ('Básico', 'Intermediário', 'Avançado'),
    Foreign Key (usuario_id) REFERENCES usuarios(id),
    Foreign Key (idioma_id) REFERENCES idiomas(id)
);

CREATE TABLE usuarios_interesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id int not null,
    interesse_id int NOT NULL,
    Foreign Key (usuario_id) REFERENCES usuarios(id),
    Foreign Key (interesse_id) REFERENCES interesses(id)
);

CREATE TABLE ofensivas (
    id int AUTO_INCREMENT PRIMARY KEY,
    usuario_id int not null,
    idioma_id int NOT NULL,
    dias_seguidos int DEFAULT 0,
    ultima_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (usuario_id) REFERENCES usuarios(id),
    Foreign Key (idioma_id) REFERENCES idiomas(id)
);

CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario1_id int not null,
    usuario2_id int not null,
    idioma_comum INT NOT NULL,
    status ENUM('pendente', 'aceito', 'rejeitado'),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (usuario1_id) REFERENCES usuarios(id),
    Foreign Key (usuario2_id) REFERENCES usuarios(id),
    Foreign Key (idioma_comum) REFERENCES idiomas(id)
);

CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT not null,
    remetente_id INT NOT NULL,
    destinatario_id int NOT NULL,
    conteudo TEXT not null,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (match_id) REFERENCES matches(id),
    Foreign Key (remetente_id) REFERENCES usuarios(id),
    Foreign Key (destinatario_id) REFERENCES usuarios(id)
);