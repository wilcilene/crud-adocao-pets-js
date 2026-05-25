/**
 * app.js  -  logica do front-end
 * Responsavel por toda a comunicacao com a API REST via fetch().
 * Opera sobre os endpoints: GET, POST, PUT, DELETE /api/humans
 */

'use strict';

// ── Constante base da API ──────────────────────────────────────
const API = '/api/humans';

// ── Referencias ao DOM ────────────────────────────────────────
const form            = document.getElementById('human-form');
const idInput         = document.getElementById('human-id');
const nomeInput       = document.getElementById('nome');
const emailInput      = document.getElementById('email');
const telefoneInput   = document.getElementById('telefone');
const cidadeInput     = document.getElementById('cidade');
const residenciaSelect= document.getElementById('tipo_residencia');
const expCheckbox     = document.getElementById('experiencia_com_pets');
const prefInput       = document.getElementById('preferencias');
const obsTextarea     = document.getElementById('observacoes');
const notificacaoDiv  = document.getElementById('notificacao');
const tabelaBody      = document.getElementById('humans-tbody');
const btnSalvar       = document.getElementById('btn-salvar');
const btnCancelar     = document.getElementById('btn-cancelar');
const btnRecarregar   = document.getElementById('btn-recarregar');
const formTitulo      = document.getElementById('form-titulo');
const formSubtitulo   = document.getElementById('form-subtitulo');

// ── Utilitarios ───────────────────────────────────────────────

/**
 * Exibe uma mensagem de feedback para o usuario.
 * @param {string} texto - Texto da mensagem
 * @param {'sucesso'|'erro'} tipo
 * @param {number} [duracao=4000] - Milissegundos antes de esconder
 */
function mostrarNotificacao(texto, tipo = 'sucesso', duracao = 4000) {
  notificacaoDiv.textContent = texto;
  notificacaoDiv.className   = `notificacao ${tipo}`;
  if (duracao > 0) {
    setTimeout(() => {
      notificacaoDiv.className = 'notificacao';
      notificacaoDiv.textContent = '';
    }, duracao);
  }
}

/** Formata uma data ISO para dd/mm/aaaa */
function formatarData(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR');
}

/** Retorna o payload do formulario como objeto */
function obterPayload() {
  return {
    nome               : nomeInput.value.trim(),
    email              : emailInput.value.trim(),
    telefone           : telefoneInput.value.trim(),
    cidade             : cidadeInput.value.trim(),
    tipo_residencia    : residenciaSelect.value,
    experiencia_com_pets: expCheckbox.checked,
    preferencias       : prefInput.value.trim(),
    observacoes        : obsTextarea.value.trim()
  };
}

/** Limpa o formulario e volta ao modo de criacao */
function limparFormulario() {
  idInput.value = '';
  form.reset();
  residenciaSelect.value = 'casa';
  btnSalvar.textContent  = 'Salvar';
  btnCancelar.style.display = 'none';
  formTitulo.textContent = '+ Novo Cadastro';
  formSubtitulo.innerHTML = 'Preencha os dados abaixo e clique em <strong>Salvar</strong>.';
}

// ── Operacoes CRUD ─────────────────────────────────────────────

/**
 * CREATE / UPDATE
 * Detecta automaticamente se e insercao (sem ID) ou edicao (com ID).
 */
async function salvar(event) {
  event.preventDefault();

  const payload = obterPayload();

  if (!payload.nome || !payload.email) {
    mostrarNotificacao('Nome e e-mail sao obrigatorios.', 'erro');
    return;
  }

  const id      = idInput.value;
  const metodo  = id ? 'PUT' : 'POST';
  const url     = id ? `${API}/${id}` : API;

  try {
    const resp = await fetch(url, {
      method : metodo,
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      throw new Error(data.error || `Erro HTTP ${resp.status}`);
    }

    mostrarNotificacao(
      id ? 'Registro atualizado com sucesso!' : 'Registro criado com sucesso!'
    );
    limparFormulario();
    await carregarLista();

  } catch (err) {
    mostrarNotificacao(err.message, 'erro');
  }
}

/**
 * READ  -  lista todos os registros
 */
async function carregarLista() {
  try {
    const resp = await fetch(API);
    if (!resp.ok) throw new Error('Erro ao carregar a lista.');
    const lista = await resp.json();
    renderizarTabela(lista);
  } catch (err) {
    mostrarNotificacao(err.message, 'erro');
  }
}

/**
 * READ BY ID  -  carrega um registro no formulario para edicao
 */
async function carregarParaEdicao(id) {
  try {
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) throw new Error('Registro nao encontrado.');
    const h = await resp.json();

    idInput.value             = h.id;
    nomeInput.value           = h.nome           || '';
    emailInput.value          = h.email          || '';
    telefoneInput.value       = h.telefone       || '';
    cidadeInput.value         = h.cidade         || '';
    residenciaSelect.value    = h.tipo_residencia || 'outro';
    expCheckbox.checked       = !!h.experiencia_com_pets;
    prefInput.value           = h.preferencias   || '';
    obsTextarea.value         = h.observacoes    || '';

    btnSalvar.textContent     = 'Atualizar';
    btnCancelar.style.display = 'inline-block';
    formTitulo.textContent    = `Editando: ${h.nome}`;
    formSubtitulo.innerHTML   = `ID ${h.id} &mdash; Altere os campos desejados e clique em <strong>Atualizar</strong>.`;

    // Rola suavemente para o formulario
    document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    mostrarNotificacao(err.message, 'erro');
  }
}

/**
 * DELETE  -  remove um registro apos confirmacao
 */
async function remover(id, nome) {
  if (!confirm(`Tem certeza que deseja remover "${nome}"? Esta acao nao pode ser desfeita.`)) {
    return;
  }

  try {
    const resp = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!resp.ok && resp.status !== 204) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.error || 'Erro ao remover registro.');
    }
    mostrarNotificacao('Registro removido com sucesso!');
    await carregarLista();
  } catch (err) {
    mostrarNotificacao(err.message, 'erro');
  }
}

// ── Renderizacao da tabela ─────────────────────────────────────

function renderizarTabela(lista) {
  tabelaBody.innerHTML = '';

  if (!lista || lista.length === 0) {
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">
            <span>&#128062;</span>
            Nenhum adotante cadastrado ainda.<br/>
            Use o formulario acima para adicionar o primeiro!
          </div>
        </td>
      </tr>`;
    return;
  }

  lista.forEach(h => {
    const tr = document.createElement('tr');

    const expBadge = h.experiencia_com_pets
      ? '<span class="badge-exp sim">Sim</span>'
      : '<span class="badge-exp nao">Nao</span>';

    tr.innerHTML = `
      <td>${h.id}</td>
      <td><strong>${esc(h.nome)}</strong></td>
      <td>${esc(h.email)}</td>
      <td>${esc(h.cidade || '—')}</td>
      <td>${esc(h.tipo_residencia || '—')}</td>
      <td>${expBadge}</td>
      <td>${formatarData(h.criado_em)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-accent btn-sm" data-id="${h.id}" data-acao="editar">Editar</button>
          <button class="btn btn-danger btn-sm" data-id="${h.id}" data-nome="${esc(h.nome)}" data-acao="remover">Remover</button>
        </div>
      </td>`;

    tabelaBody.appendChild(tr);
  });
}

/** Escapa caracteres HTML para evitar XSS ao inserir no DOM */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Event listeners ────────────────────────────────────────────

form.addEventListener('submit', salvar);

btnCancelar.addEventListener('click', limparFormulario);

btnRecarregar.addEventListener('click', carregarLista);

// Delegacao de eventos na tabela (editar / remover)
tabelaBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-acao]');
  if (!btn) return;

  const { acao, id, nome } = btn.dataset;

  if (acao === 'editar')  carregarParaEdicao(id);
  if (acao === 'remover') remover(id, nome);
});

// ── Inicializacao ──────────────────────────────────────────────
carregarLista();
