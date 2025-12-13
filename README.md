# 🎓 AvaliaProf API

API REST para avaliação anônima de professores, desenvolvida com **NestJS**, **Prisma** e **PostgreSQL**, com autenticação JWT, documentação via Swagger e foco em boas práticas de backend.

> Projeto desenvolvido com fins acadêmicos e educacionais, simulando um sistema real de avaliações institucionais.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** 
- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (Access & Refresh Token)**
- **Swagger (OpenAPI)**
- **Docker (Postgres local)**

---

## 📌 Funcionalidades

### 🔐 Autenticação
- Cadastro de usuários (STUDENT)
- Login com JWT
- Refresh Token
- Endpoint `/me` protegido
- Controle de acesso por role

### 📝 Avaliações
- Criar avaliação de professor
- Avaliar por critérios (didática, assiduidade, etc.)
- Listar minhas avaliações
- Listar avaliações por professor
- Calcular média por critério

### 👨‍🏫 Estrutura Acadêmica
- Professores
- Disciplinas
- Relacionamento entre professores e disciplinas

---

## 🧠 Arquitetura

- **REST API**
- **JWT Stateless Authentication**
- **DTOs com validação**
- **Separação clara de camadas**
- **Prisma com integridade referencial**
- **Swagger bem documentado**

---

## 📂 Estrutura do Projeto

```bash
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── guards/
│
├── evaluations/
│   ├── evaluations.controller.ts
│   ├── evaluations.service.ts
│   └── dto/
│
├── prisma/
│   └── prisma.service.ts
│
├── common/
│   └── configs/
│
├── app.module.ts
└── main.ts
```

---

## ⚙️ Como Rodar Localmente

### 1️⃣ Clonar o repositório

```bash
git clone [https://github.com/GabrielKayran/avaliaprof-api](https://github.com/GabrielKayran/avaliaprof-api)
cd avaliaprof-api
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Subir o PostgreSQL com Docker

```bash
docker run --name avaliaprof-postgres \
  -e POSTGRES_USER=prisma \
  -e POSTGRES_PASSWORD=prisma \
  -e POSTGRES_DB=avaliaprof \
  -p 5432:5432 \
  -d postgres:15
```

### 4️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://prisma:prisma@localhost:5432/avaliaprof?schema=public

JWT_ACCESS_SECRET=dev_access_secret
JWT_REFRESH_SECRET=dev_refresh_secret

JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

PORT=3000
```

### 5️⃣ Rodar migrations e seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 6️⃣ Rodar a API

```bash
npm run start:dev
```

---

## 📚 Documentação (Swagger)

Acesse: **[http://localhost:3000/api](http://localhost:3000/api)**

- Todos os endpoints documentados
- Autenticação via botão **Authorize**
- Testes diretos pela interface

### 🔑 Autenticação no Swagger

1. Faça login em `/auth/login`
2. Copie o `accessToken`
3. Clique no botão **Authorize** no topo da página
4. Cole o token no formato:

```text
Bearer SEU_TOKEN_AQUI
```

---

## 🧪 Exemplo de Avaliação

**POST** `/evaluations`

```json
{
  "disciplineId": "uuid-da-disciplina",
  "teacherId": "uuid-do-professor",
  "comment": "Excelente didática, explica muito bem",
  "scores": [
    { "criterionId": "didatica", "note": 5 },
    { "criterionId": "assiduidade", "note": 4 }
  ]
}
```

---

## 🛡️ Segurança

- Senhas armazenadas com hash (bcrypt/argon2)
- JWT com expiração configurável
- Refresh token separado
- Endpoints protegidos por Guards