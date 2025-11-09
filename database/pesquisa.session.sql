CREATE DATABASE dbbarbearia;
-- @block
show TABLEs;

-- @block
CREATE TABLE usuarios(
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE questionarios
(
    id_questionario INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    texto_questionario VARCHAR(255) NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    CONSTRAINT fk_usuarios_questionarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)

);


CREATE TABLE perguntas(
    id_pergunta INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    texto_pergunta VARCHAR(255) NOT NULL,
    id_questionario INT UNSIGNED NOT NULL,
    CONSTRAINT fk_questionarios_perguntas FOREIGN KEY (id_questionario) REFERENCES questionarios(id_questionario)
);

CREATE TABLE respostas(
    id_respostas INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_pergunta INT UNSIGNED NOT NULL,
    texto_resposta VARCHAR(255) NOT NULL,
    CONSTRAINT fk_perguntas_respostas FOREIGN KEY (id_pergunta) REFERENCES perguntas(id_pergunta)
);



-- @block
INSERT INTO usuarios (nome,email,senha) VALUES ('Jonas','jonas1234@gmail.com','jonas199720000');

INSERT INTO questionarios (texto_questionario,id_usuario) VALUES ('Questionário de Feedback sobre a aula',1);

INSERT INTO perguntas (texto_pergunta,id_questionario) VALUES ('O que você achou da aula?',1);

INSERT INTO respostas (id_pergunta,texto_resposta) VALUES (1,'Muito boa'),(1,'Decente'),(1,'Ruim'),(1,'Horrível');

-- @block
SELECT texto_pergunta,texto_resposta FROM respostas 
INNER JOIN perguntas ON respostas.id_pergunta = perguntas.id_pergunta
INNER JOIN questionarios ON perguntas.id_questionario = questionarios.id_questionario
INNER JOIN usuarios ON usuarios.id_usuario = questionarios.id_usuario
WHERE usuarios.id_usuario = 2
;


