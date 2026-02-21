# 🗄️ Configuração de Banco de Dados

## 📍 Banco de Dados Atual (Neon)

Seu projeto está configurado para usar **Neon** como banco de dados em desenvolvimento.

**Credenciais Atuais:**
- **Host**: `ep-solitary-mountain-acn3igj7-pooler.sa-east-1.aws.neon.tech`
- **Usuário**: `neondb_owner`
- **Banco**: `neondb`
- **Região**: `sa-east-1` (São Paulo)

---

## 🚀 Como Usar

### 1️⃣ Verificar conexão

```bash
# Testar conexão com o banco
npm run start:dev
```

Se conseguir iniciar sem erros de conexão, está funcionando!

### 2️⃣ Rodar migrations

```bash
# Aplica todas as migrations ao banco Neon
npx prisma migrate deploy
```

### 3️⃣ Visualizar dados (Prisma Studio)

```bash
# Abre interface web para gerenciar dados
npm run prisma:studio
```

---

## 🔄 Alternar para Banco Local (Opcional)

Se quiser usar PostgreSQL local em vez de Neon:

### 1. Descomente as linhas no `.env`:

```env
# Descomente estas linhas:
POSTGRES_USER=prisma
POSTGRES_PASSWORD=prisma
POSTGRES_DB=avaliaprof
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=public
DATABASE_URL=postgresql://prisma:prisma@localhost:5432/avaliaprof?schema=public

# Comente esta linha:
# DATABASE_URL=postgresql://neondb_owner:npg_RlI1YbshVLp6@...
```

### 2. Inicie PostgreSQL local:

```bash
# Com Docker
docker run --name avaliaprof-postgres \
  -e POSTGRES_USER=prisma \
  -e POSTGRES_PASSWORD=prisma \
  -e POSTGRES_DB=avaliaprof \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Rode migrations:

```bash
npx prisma migrate deploy
```

---

## 📝 Estrutura de Ambientes

```
.env              ← Produção/Desenvolvimento (Neon)
.env.local        ← Local (PostgreSQL local)
.env.example      ← Template de referência
```

### Quando usar cada um:

- **`.env`** - Configuração padrão (desenvolvimento com Neon)
- **`.env.local`** - Quando testar localmente com PostgreSQL
- **`.env.example`** - Guia de variáveis necessárias

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- Nunca commita `.env` com credenciais reais
- Mantenha `.env` no `.gitignore` (já está configurado)
- Use `.env.example` como template público

---

## 🆘 Troubleshooting

### Erro: "connect ECONNREFUSED"

Se receber esse erro:
```
connect ECONNREFUSED 127.0.0.1:5432
```

**Significa**: Está tentando conectar ao PostgreSQL local que não está rodando.

**Solução**: 
- Use o `.env` com Neon (padrão)
- Ou inicie PostgreSQL com Docker (veja acima)

### Erro: "SSL error"

Se receber erro de SSL ao conectar a Neon:

Certifique-se que a `DATABASE_URL` tem:
```
?sslmode=require&channel_binding=require
```

---

## 📊 Informações Úteis

### Verificar estado das migrations:

```bash
npx prisma migrate status
```

### Criar nova migration:

```bash
npx prisma migrate dev --name sua_descricao
```

### Resetar banco (CUIDADO - deleta tudo):

```bash
npx prisma migrate reset
```

---

## 🔗 Links Úteis

- [Documentação Neon](https://neon.tech/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
