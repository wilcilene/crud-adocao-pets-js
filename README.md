# 🐾 crud-adocao-pets-js README.md -> criado com apoio de IA

> Projeto didático de **CRUD completo** com Node.js, Express, MySQL e `fetch()` no navegador.  
> Formulário para cadastro de humanos interessados em adotar pets — operações de **Criar, Listar, Atualizar e Remover** direto pela interface web.
---

## 📁 Estrutura do projeto

```
crud-adocao-pets-js/
├── server.js              # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
├── .env.example           # Variáveis de ambiente (modelo)
├── .gitignore
├── LICENSE
│
├── config/
│   └── db.js              # Pool de conexão com o MySQL
│
├── controllers/
│   └── human.controller.js  # Lógica HTTP (req/res)
│
├── models/
│   └── human.model.js       # Queries SQL parametrizadas
│
├── routes/
│   └── human.routes.js      # Mapeamento de rotas REST
│
├── sql/
│   └── schema.sql           # Script de criação do banco e tabela
│
└── public/                  # Front-end estático servido pelo Express
    ├── index.html
    ├── style.css
    └── app.js
```

---

## 🚀 Como executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- [MySQL](https://www.mysql.com/) rodando localmente

### 1. Clone o repositório
```bash
git clone https://github.com/wilcilene/crud-adocao-pets-js.git
cd crud-adocao-pets-js
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
mysql -u seu_usuario -p < sql/schema.sql
```

### 4. Configure as variáveis de ambiente
```bash
cp .env.example .env
# edite o .env com suas credenciais do MySQL
```

### 5. Execute o servidor
```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🔌 Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/humans` | Lista todos os cadastros |
| GET | `/api/humans/:id` | Busca um cadastro por ID |
| POST | `/api/humans` | Cria um novo cadastro |
| PUT | `/api/humans/:id` | Atualiza um cadastro |
| DELETE | `/api/humans/:id` | Remove um cadastro |

---

## 🛠️ Tecnologias

- **Back-end:** Node.js, Express, mysql2
- **Front-end:** HTML5, CSS3, JavaScript (fetch API)
- **Banco de dados:** MySQL
- **Utilitários:** dotenv, cors, nodemon

---

## 📄 Licença

MIT © [wilcilene](https://github.com/wilcilene)
