const express = require('express');
const cors    = require('cors');
const path    = require('path');
const dotenv  = require('dotenv');

dotenv.config();

const humanRoutes = require('./routes/human.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Arquivos estaticos (front-end) ─────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Rotas da API ───────────────────────────────────────────
app.use('/api/humans', humanRoutes);

// ── 404 catch-all ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada.' });
});

// ── Inicia o servidor ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
