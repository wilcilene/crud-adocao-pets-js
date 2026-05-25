const express        = require('express');
const HumanController = require('../controllers/human.controller');

const router = express.Router();

/**
 * Rotas REST para o recurso /api/humans
 *
 * GET    /          -> lista todos
 * GET    /:id       -> busca por ID
 * POST   /          -> cria novo
 * PUT    /:id       -> atualiza
 * DELETE /:id       -> remove
 */
router.get   ('/',    HumanController.getAll);
router.get   ('/:id', HumanController.getById);
router.post  ('/',    HumanController.create);
router.put   ('/:id', HumanController.update);
router.delete('/:id', HumanController.remove);

module.exports = router;
