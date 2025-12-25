#  Extrack – Sistema de Gerenciamento de Projetos de Extensão

Extrack é uma aplicação web desenvolvida para **cadastrar, listar, editar e visualizar projetos de extensão universitária**. Com foco em simplicidade e organização, oferece uma interface intuitiva para usuários gerenciarem seus projetos de forma segura.

## Acesse agora
Quando acessar aguarde um pouco até a página ser buildada. 

**[https://extrack-dyga.onrender.com](https://extrack-dyga.onrender.com)**

---

##  Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Criação de projetos com título, datas, metas e links de evidência
- Edição e exclusão de projetos
- Busca e filtro por status
- Seleção e exclusão em massa de projetos
- Recuperação de senha via e-mail
- Interface 100% responsiva com TailwindCSS
- Toasts de feedback amigáveis com Vue3 Toastify

---

## Tecnologias Utilizadas

### Frontend (Vite + Vue 3)
- Vue 3
- Pinia (state management)
- Vue Router
- TailwindCSS
- Axios
- Vue3 Toastify

### Backend (Node + Express)
- Express
- MongoDB (via Mongoose)
- JWT (Autenticação)
- Bcrypt (Criptografia de senha)
- Nodemailer (Recuperação de senha)

---

## Estrutura do Projeto

```
project/
├── server/             # Backend Node.js + Express
│   ├── routes/         # Rotas de autenticação e projetos
│   ├── models/         # Mongoose Models
│   └── index.js        # Arquivo principal do servidor
│
├── src/                # Frontend Vue.js
│   ├── views/          # Páginas do sistema (login, projetos, etc)
│   ├── stores/         # Pinia stores
│   ├── components/     # Componentes reutilizáveis
│   └── App.vue         # Raiz da aplicação
│
└── .env                # Variáveis de ambiente
```

---

## Como rodar localmente

1. **Clone o projeto**
```bash
git clone https://github.com/seu-usuario/extrack.git
cd extrack
```

2. **Configure variáveis de ambiente**

Crie um arquivo `.env` dentro da pasta `server/` com:

```
MONGODB_URI=...
JWT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
PORT=5000
```

3. **Instale as dependências**
```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

4. **Execute o backend**
```bash
cd server
node index.js
```

5. **Execute o frontend**
```bash
cd ..
npm run dev
```

---

## Recuperação de senha

O sistema envia e-mails para redefinição de senha com link único e temporário. A configuração do e-mail é feita via `EMAIL_USER` e `EMAIL_PASS` no `.env`.

---

## Deploy

A aplicação está hospedada em:
- **Render** para o backend
- **Render** (mesmo app) serve também o frontend compilado com Vite

---

## Contribuições

Este projeto está em fase de desenvolvimento. Sugestões e melhorias são bem-vindas!

---

## Licença

MIT License

---

**Desenvolvido por Alyson França**
