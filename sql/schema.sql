-- =============================================================
--  Schema: adocao_pets
--  Descricao: banco de dados para o projeto CRUD de adocao
--  Uso: mysql -u seu_usuario -p < sql/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS adocao_pets
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE adocao_pets;

-- -------------------------------------------------------------
--  Tabela: humans
--  Registra pessoas interessadas em adotar um pet
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS humans (
  id                   INT          AUTO_INCREMENT PRIMARY KEY,
  nome                 VARCHAR(120) NOT NULL,
  email                VARCHAR(120) NOT NULL UNIQUE,
  telefone             VARCHAR(30),
  cidade               VARCHAR(80),
  tipo_residencia      ENUM('casa','apartamento','chacara','outro') DEFAULT 'outro',
  experiencia_com_pets TINYINT(1)   NOT NULL DEFAULT 0,
  preferencias         VARCHAR(255),
  observacoes          TEXT,
  criado_em            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  atualizado_em        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
--  Dados de exemplo (opcional)
-- -------------------------------------------------------------
INSERT INTO humans (nome, email, telefone, cidade, tipo_residencia, experiencia_com_pets, preferencias)
VALUES
  ('Ana Paula Silva',  'ana@example.com',   '(47) 99111-2233', 'Joinville',      'casa',        1, 'Caes de porte medio'),
  ('Carlos Souza',     'carlos@example.com','(47) 98222-3344', 'Sao Bento do Sul','apartamento', 0, 'Gatos adultos'),
  ('Mariana Costa',   'mari@example.com',  '(47) 97333-4455', 'Blumenau',       'chacara',     1, 'Qualquer pet');
