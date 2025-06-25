-- Limpando dados anteriores
USE fluencytcc;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE mensagens;
TRUNCATE TABLE matches;
TRUNCATE TABLE ofensivas;
TRUNCATE TABLE usuarios_interesses;
TRUNCATE TABLE usuarios_idiomas;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE idiomas;
TRUNCATE TABLE interesses;
TRUNCATE TABLE generos;
TRUNCATE TABLE paises;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserindo gêneros
INSERT INTO generos (genero) VALUES 
('Masculino'), ('Feminino'), ('Outro');

-- Inserindo idiomas
INSERT INTO idiomas (idioma) VALUES 
('Inglês'), ('Espanhol'), ('Português'), ('Francês'), ('Alemão'), 
('Italiano'), ('Japonês'), ('Chinês'), ('Russo'), ('Coreano'), 
('Árabe'), ('Hindi'), ('Turco'), ('Sueco'), ('Norueguês'), 
('Polonês'), ('Grego'), ('Tailandês'), ('Vietnamita'), ('Hebraico');

-- Inserindo países
INSERT INTO paises (nome) VALUES 
('Brasil'), ('Estados Unidos'), ('Espanha'), ('França'), ('Alemanha'),
('Itália'), ('Japão'), ('China'), ('Rússia'), ('Coreia do Sul'),
('Índia'), ('Canadá'), ('Austrália'), ('Argentina'), ('México'),
('Egito'), ('África do Sul'), ('Portugal'), ('Suécia'), ('Noruega');

-- Inserindo interesses
INSERT INTO interesses (interesse) VALUES 
('Viagens'), ('Negócios'), ('Tecnologia'), ('Música'), ('Esportes'),
('Culinária'), ('Cinema'), ('História'), ('Jogos'), ('Leitura'),
('Fotografia'), ('Natureza'), ('Educação'), ('Saúde'), ('Artes'),
('Dança'), ('Programação'), ('Pets'), ('Meditação'), ('Voluntariado');

-- Inserindo usuários fictícios
INSERT INTO usuarios (username, email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id, bio, foto_perfil) VALUES
('Lucas', 'lucas@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 3, 1, '1995-08-15', 1, 'Apaixonado por idiomas e viagens.', NULL),
('Emily', 'emily@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 1, 2, '1998-02-22', 2, 'Amo explorar culturas.', NULL),
('Ravi', 'ravi@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 12, 1, '1992-05-30', 11, 'Estudo línguas por hobby.', NULL),
('Yuki', 'yuki@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 7, 2, '1990-09-12', 7, 'Busco amigos para praticar.', NULL),
('Carlos', 'carlos@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 2, 1, '1987-07-03', 3, 'Falante nativo de espanhol.', NULL),
('Marie', 'marie@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 4, 2, '1994-11-25', 4, 'Gosto de música francesa.', NULL),
('Ahmed', 'ahmed@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 11, 1, '1991-03-17', 16, 'Praticando português.', NULL),
('Julia', 'julia@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 1, 2, '1999-06-08', 12, 'Sou fluida em inglês.', NULL),
('Mateo', 'mateo@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 2, 1, '1989-04-12', 14, 'Buscando amigos para conversar.', NULL),
('Anna', 'anna@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 6, 2, '1988-10-05', 9, 'Estudando russo e português.', NULL),
('Sophie', 'sophie@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 14, 2, '1996-03-10', 19, 'Amo aprender sobre culturas nórdicas.', NULL),
('Hiroshi', 'hiroshi@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 7, 1, '1990-01-25', 7, 'Interesse em tecnologia e idiomas', NULL),
('Clara', 'clara@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 3, 2, '1998-07-19', 1, 'Entusiasta de culinária e idiomas.', NULL),
('Dmitri', 'dmitri@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 9, 1, '1988-10-05', 9, 'Apaionado por história e idiomas.', NULL),
('Sofia', 'sofia@email.com', '$2b$10$GzIOT9pgjJipy3.RqjTkTOrfi3QDDnGjMNFjWPLe9PLhAWr7gkeYq', 15, 2, '1995-04-01', 20, 'Praticando inglês e francês.', NULL);

-- Idiomas que os usuários estão aprendendo
INSERT INTO usuarios_idiomas (usuario_id, idioma_id, nivel) VALUES
(1, 1, 'Avançado'), (1, 2, 'Intermediário'),
(2, 3, 'Intermediário'), (2, 4, 'Básico'),
(3, 1, 'Avançado'), (3, 5, 'Intermediário'),
(4, 2, 'Avançado'), (4, 3, 'Intermediário'),
(5, 1, 'Básico'), (5, 4, 'Avançado'),
(6, 5, 'Intermediário'), (6, 3, 'Intermediário'),
(7, 3, 'Básico'), (7, 1, 'Básico'),
(8, 2, 'Avançado'), (8, 4, 'Intermediário'),
(9, 1, 'Intermediário'), (9, 3, 'Intermediário'),
(10, 9, 'Básico'), (10, 3, 'Intermediário'),
(11, 1, 'Intermediário'), (11, 3, 'Básico'),
(12, 1, 'Avançado'), (12, 3, 'Intermediário'),
(13, 1, 'Intermediário'), (13, 4, 'Básico'),
(14, 3, 'Intermediário'), (14, 1, 'Básico'),
(15, 1, 'Avançado'), (15, 4, 'Intermediário');

-- Interesses dos usuários
INSERT INTO usuarios_interesses (usuario_id, interesse_id) VALUES
(1, 1), (1, 3), (1, 6),
(2, 4), (2, 7),
(3, 2), (3, 10), (3, 17),
(4, 5), (4, 6), (4, 11),
(5, 1), (5, 2),
(6, 4), (6, 5), (6, 19),
(7, 9), (7, 3),
(8, 8), (8, 10), (8, 12),
(9, 1), (9, 3),
(10, 6), (10, 14),
(11, 12), (11, 19), (11, 15),
(12, 3), (12, 17), (12, 9),
(13, 6), (13, 1), (13, 4),
(14, 8), (14, 10), (14, 13),
(15, 4), (15, 7), (15, 12);

-- Matches entre usuários com idioma em comum
INSERT INTO matches (usuario1_id, usuario2_id, idioma_comum, status) VALUES
(1, 2, 3, 'aceito'),
(3, 4, 1, 'pendente'),
(5, 6, 4, 'aceito'),
(7, 8, 1, 'rejeitado'),
(9, 10, 3, 'pendente'),
(1, 11, 3, 'aceito'),
(2, 12, 3, 'pendente'),
(3, 15, 1, 'aceito'),
(4, 13, 3, 'rejeitado'),
(5, 14, 1, 'pendente'),
(6, 15, 4, 'aceito'),
(7, 11, 3, 'pendente'),
(8, 12, 1, 'aceito'),
(9, 13, 3, 'aceito'),
(10, 14, 3, 'rejeitado'),
(11, 15, 1, 'aceito'),
(12, 13, 3, 'pendente'),
(14, 15, 1, 'aceito');