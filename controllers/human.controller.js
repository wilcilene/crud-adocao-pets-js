const Human = require('../models/human.model');

/**
 * Human Controller
 * Responsavel pela logica HTTP: valida a requisicao,
 * chama o model e devolve a resposta adequada.
 */
const HumanController = {

  /** GET /api/humans */
  async getAll(req, res) {
    try {
      const humans = await Human.findAll();
      res.json(humans);
    } catch (err) {
      console.error('[getAll]', err.message);
      res.status(500).json({ error: 'Erro ao listar registros.' });
    }
  },

  /** GET /api/humans/:id */
  async getById(req, res) {
    try {
      const human = await Human.findById(req.params.id);
      if (!human) return res.status(404).json({ error: 'Registro nao encontrado.' });
      res.json(human);
    } catch (err) {
      console.error('[getById]', err.message);
      res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
  },

  /** POST /api/humans */
  async create(req, res) {
    try {
      const { nome, email } = req.body;
      if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e e-mail sao obrigatorios.' });
      }
      const created = await Human.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      console.error('[create]', err.message);
      // Trata email duplicado (MySQL error 1062)
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'E-mail ja cadastrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar registro.' });
    }
  },

  /** PUT /api/humans/:id */
  async update(req, res) {
    try {
      const existing = await Human.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Registro nao encontrado.' });

      const { nome, email } = req.body;
      if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e e-mail sao obrigatorios.' });
      }
      const updated = await Human.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      console.error('[update]', err.message);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'E-mail ja cadastrado por outro registro.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
  },

  /** DELETE /api/humans/:id */
  async remove(req, res) {
    try {
      const existing = await Human.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Registro nao encontrado.' });

      await Human.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      console.error('[remove]', err.message);
      res.status(500).json({ error: 'Erro ao remover registro.' });
    }
  }
};

module.exports = HumanController;
