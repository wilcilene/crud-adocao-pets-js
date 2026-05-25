const db = require('../config/db');

/**
 * Human Model
 * Encapsula todas as queries SQL relacionadas a tabela humans.
 * Utiliza consultas parametrizadas (?) para prevenir SQL Injection.
 */
const Human = {

  /** Retorna todos os registros ordenados do mais recente */
  async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM humans ORDER BY criado_em DESC'
    );
    return rows;
  },

  /** Busca um unico registro pelo ID */
  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM humans WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /** Insere um novo registro e retorna o objeto criado */
  async create(data) {
    const { nome, email, telefone, cidade, tipo_residencia,
            experiencia_com_pets, preferencias, observacoes } = data;

    const [result] = await db.query(
      `INSERT INTO humans
         (nome, email, telefone, cidade, tipo_residencia,
          experiencia_com_pets, preferencias, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        email,
        telefone   || null,
        cidade     || null,
        tipo_residencia       || 'outro',
        experiencia_com_pets  ? 1 : 0,
        preferencias || null,
        observacoes  || null
      ]
    );
    return this.findById(result.insertId);
  },

  /** Atualiza um registro existente e retorna o objeto atualizado */
  async update(id, data) {
    const { nome, email, telefone, cidade, tipo_residencia,
            experiencia_com_pets, preferencias, observacoes } = data;

    await db.query(
      `UPDATE humans
       SET nome = ?, email = ?, telefone = ?, cidade = ?,
           tipo_residencia = ?, experiencia_com_pets = ?,
           preferencias = ?, observacoes = ?
       WHERE id = ?`,
      [
        nome,
        email,
        telefone   || null,
        cidade     || null,
        tipo_residencia      || 'outro',
        experiencia_com_pets ? 1 : 0,
        preferencias || null,
        observacoes  || null,
        id
      ]
    );
    return this.findById(id);
  },

  /** Remove um registro pelo ID */
  async remove(id) {
    await db.query('DELETE FROM humans WHERE id = ?', [id]);
  }
};

module.exports = Human;
