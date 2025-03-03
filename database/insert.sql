-- Desabilitar temporariamente as restrições de chave estrangeira
SET FOREIGN_KEY_CHECKS = 0;

-- Truncar todas as tabelas para resetar os IDs
TRUNCATE TABLE generos;
TRUNCATE TABLE idiomas;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE interesses;
TRUNCATE TABLE usuarios_idiomas;
TRUNCATE TABLE usuarios_interesses;
TRUNCATE TABLE ofensivas;
TRUNCATE TABLE matches;
TRUNCATE TABLE mensagens;

-- Habilitar novamente as restrições de chave estrangeira
SET FOREIGN_KEY_CHECKS = 1;

-- Inserir gêneros
INSERT INTO generos (genero) VALUES ('Masculino'), ('Feminino'), ('Outro');

-- Inserir idiomas
INSERT INTO idiomas (idioma) VALUES 
('Inglês'),
('Espanhol'),
('Português'),
('Francês'),
('Alemão');

-- Inserir usuários
INSERT INTO usuarios (username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil) VALUES 
('Carlos', 'carlos@email.com', '123456', 3, 1, 'Quero aprender inglês!', 'carlos.jpg'),
('Alice', 'alice@email.com', '123456', 1, 2, 'Adoro ensinar inglês!', 'alice.jpg'),
('Miguel', 'miguel@email.com', '123456', 2, 1, 'Falante nativo de espanhol, aprendendo francês.', 'miguel.jpg'),
('Sophia', 'sophia@email.com', '123456', 4, 2, 'Aprendendo alemão e ajudando com francês.', 'sophia.jpg'),
('Lucas', 'lucas@email.com', '123456', 1, 1, 'Falo inglês e quero aprender português.', 'lucas.jpg');

-- Inserir relação usuário-idioma
INSERT INTO usuarios_idiomas (usuario_id, idioma_id, nivel) VALUES 
(1, 3, 'Avançado'), 
(1, 1, 'Básico'),  
(2, 1, 'Avançado'), 
(2, 3, 'Intermediário'), 
(3, 2, 'Avançado'), 
(3, 4, 'Básico'),   
(4, 4, 'Avançado'), 
(4, 5, 'Básico'),   
(5, 1, 'Avançado'), 
(5, 3, 'Básico');   

-- Inserir interesses
INSERT INTO interesses (interesse) VALUES 
('Viagens'), 
('Tecnologia'), 
('Música'), 
('Negócios');

-- Associar interesses aos usuários
INSERT INTO usuarios_interesses (usuario_id, interesse_id) VALUES 
(1, 1), 
(1, 2), 
(2, 2), 
(3, 3), 
(4, 1), 
(5, 4);

-- Inserir ofensivas
INSERT INTO ofensivas (usuario_id, idioma_id, dias_seguidos) VALUES 
(1, 1, 5), 
(2, 3, 10), 
(3, 4, 3), 
(4, 5, 7);
