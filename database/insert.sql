-- Apaga os dados existentes e reseta os IDs
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
SET FOREIGN_KEY_CHECKS = 1;

-- Insere gêneros
INSERT INTO generos (genero) VALUES ('Masculino'), ('Feminino'), ('Outro');

-- Insere idiomas
INSERT INTO idiomas (idioma) VALUES ('Inglês'), ('Espanhol'), ('Português'), ('Francês'), ('Alemão');

-- Insere interesses
INSERT INTO interesses (interesse) VALUES ('Viagens'), ('Negócios'), ('Tecnologia'), ('Música');

-- Insere usuários
INSERT INTO usuarios (username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil) VALUES
('Alice', 'alice@email.com', '123456', 3, 2, 'Apaixonada por idiomas!', NULL),
('Bob', 'bob@email.com', '123456', 1, 1, 'Gosto de tecnologia.', NULL),
('Carlos', 'carlos@email.com', '123456', 2, 1, 'Viajante do mundo!', NULL),
('Diana', 'diana@email.com', '123456', 4, 2, 'Amante de música.', NULL);

-- Insere idiomas que os usuários estão aprendendo
INSERT INTO usuarios_idiomas (usuario_id, idioma_id, nivel) VALUES
(1, 1, 'Intermediário'),  -- Alice quer aprender Inglês
(2, 3, 'Intermediário'),  -- Bob quer aprender Português
(3, 4, 'Básico'),        -- Carlos quer aprender Francês
(4, 2, 'Avançado');      -- Diana já sabe Espanhol

INSERT INTO usuarios_idiomas (usuario_id, idioma_id, nivel) VALUES
(1, 2, 'Avançado'),  -- Alice também fala Espanhol (para combinar com Carlos)
(3, 1, 'Básico');    -- Carlos quer aprender Inglês (para combinar com Alice)


-- Insere interesses dos usuários
INSERT INTO usuarios_interesses (usuario_id, interesse_id) VALUES
(1, 1), (1, 2), -- Alice gosta de Viagens e Negócios
(2, 3), (2, 4), -- Bob gosta de Tecnologia e Música
(3, 1), (3, 4), -- Carlos gosta de Viagens e Música
(4, 2), (4, 3); -- Diana gosta de Negócios e Tecnologia

-- Insere matches fictícios
INSERT INTO matches (usuario1_id, usuario2_id, idioma_comum, status) VALUES
(1, 2, 3, 'aceito'),  -- Alice e Bob têm Português em comum
(1, 3, 2, 'pendente'),-- Alice e Carlos compartilham Espanhol
(2, 4, 3, 'aceito');  -- Bob e Diana compartilham Português

