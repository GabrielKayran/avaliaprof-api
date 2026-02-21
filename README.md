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

### 👨‍🏫 Gerenciamento de Professores
- CRUD completo de professores (Create, Read, Update, Delete)
- Listar professores com paginação
- Obter detalhes de um professor
- Histórico de avaliações por professor

### 📚 Gerenciamento de Disciplinas
- CRUD completo de disciplinas
- Listar disciplinas com paginação
- Código único de disciplina (opcional)
- Relacionamento com professores

### 📝 Avaliações
- Criar avaliação de professor
- Avaliar por critérios (didática, assiduidade, etc.)
- Listar minhas avaliações com paginação
- Listar avaliações por professor com paginação
- Calcular média por critério
- Sistema de comentários anônimos

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
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── password.service.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── dto/
│   │   ├── jwt.dto.ts
│   │   ├── login.input.ts
│   │   └── signup.input.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── models/
│       └── token.model.ts
│
├── disciplines/
│   ├── disciplines.controller.ts
│   ├── disciplines.module.ts
│   ├── disciplines.service.ts
│   ├── disciplines.service.spec.ts
│   └── dto/
│       ├── create-discipline.dto.ts
│       └── update-discipline.dto.ts
│
├── teachers/
│   ├── teachers.controller.ts
│   ├── teachers.module.ts
│   ├── teachers.service.ts
│   ├── teachers.service.spec.ts
│   └── dto/
│       ├── create-teacher.dto.ts
│       └── update-teacher.dto.ts
│
├── evaluations/
│   ├── evaluations.controller.ts
│   ├── evaluations.module.ts
│   ├── evaluations.service.ts
│   ├── evaluations.service.spec.ts
│   └── dto/
│       └── create-evaluation.dto.ts
│
├── common/
│   ├── configs/
│   │   ├── config.interface.ts
│   │   └── config.ts
│   ├── decorators/
│   ├── models/
│   └── pagination/
│       ├── pagination.dto.ts
│       ├── pagination.response.ts
│       └── index.ts
│
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── metadata.ts

prisma/
├── schema.prisma
├── seed.ts
└── migrations/
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

### 7️⃣ Rodar testes unitários (Opcional)

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- evaluations.service.spec
npm test -- disciplines.service.spec
npm test -- teachers.service.spec
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

## 📡 Endpoints da API

### 🔐 Autenticação
- `POST /auth/signup` - Cadastro de novo usuário
- `POST /auth/login` - Login (retorna accessToken e refreshToken)
- `POST /auth/refresh` - Renovar token de acesso
- `GET /auth/me` - Dados do usuário autenticado

### 👨‍🏫 Professores (Teachers)
- `GET /teachers` - Listar professores (paginado)
- `POST /teachers` - Criar novo professor
- `GET /teachers/:id` - Obter detalhes de um professor
- `PUT /teachers/:id` - Atualizar professor
- `DELETE /teachers/:id` - Deletar professor

### 📚 Disciplinas (Disciplines)
- `GET /disciplines` - Listar disciplinas (paginado)
- `POST /disciplines` - Criar nova disciplina
- `GET /disciplines/:id` - Obter detalhes de uma disciplina
- `PUT /disciplines/:id` - Atualizar disciplina
- `DELETE /disciplines/:id` - Deletar disciplina

### 📝 Avaliações (Evaluations)
- `POST /evaluations` - Criar avaliação
- `GET /evaluations/my` - Minhas avaliações (paginado)
- `GET /evaluations/teacher/:teacherId` - Avaliações de um professor (paginado)
- `GET /evaluations/teacher/:teacherId/average` - Média de avaliação por critério

---

## 🧪 Exemplos de Uso

### 1. Cadastrar um novo professor

**POST** `/teachers`

```json
{
  "name": "Dr. João Silva",
  "title": "Doutor"
}
```

### 2. Criar uma disciplina

**POST** `/disciplines`

```json
{
  "name": "Cálculo I",
  "code": "CALC001"
}
```

### 3. Listar professores com paginação

**GET** `/teachers?page=1&limit=10`

Resposta:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Dr. João Silva",
      "title": "Doutor",
      "disciplines": [
        {
          "id": "disc-1",
          "name": "Cálculo I"
        }
      ],
      "evaluations": [
        {
          "id": "eval-1"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### 4. Criar uma avaliação

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

- ✅ Senhas armazenadas com hash (bcrypt/argon2)
- ✅ JWT com expiração configurável
- ✅ Refresh token separado
- ✅ Endpoints protegidos por Guards
- ✅ Validação de entrada com class-validator
- ✅ Tratamento de erros padronizado
- ✅ CORS configurável

---

## 💡 Boas Práticas Implementadas

- ✅ **Separação de camadas**: Controllers, Services e DTOs
- ✅ **Paginação**: Todos os endpoints GET retornam dados paginados
- ✅ **Validação**: DTOs com validação automática
- ✅ **Tratamento de erro**: Exceções customizadas (NotFoundException, BadRequestException)
- ✅ **Documentação**: Swagger/OpenAPI automático
- ✅ **Testes**: Testes unitários para services
- ✅ **Type Safety**: TypeScript em todo o projeto
- ✅ **ORM**: Prisma com type safety

---

## 🔄 Padrão de Resposta

### Sucesso (200, 201)
```json
{
  "id": "uuid-123",
  "name": "exemplo",
  "title": "Doutor",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Paginação
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Item 1"
    },
    {
      "id": "uuid-2",
      "name": "Item 2"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Erro (400, 404, 500)
```json
{
  "statusCode": 400,
  "message": "Disciplina com este código já existe",
  "error": "Bad Request"
}
``` 

---