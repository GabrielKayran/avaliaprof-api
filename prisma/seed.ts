import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // limpa tudo (ordem importa por FK)
  await prisma.evaluationScore.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const student = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'teste@ufu.br',
      password: '123',
      role: Role.STUDENT,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'teste@admin',
      password: '123',
      role: Role.ADMIN,
    },
  });

  // Disciplines
  const bd = await prisma.discipline.create({
    data: { name: 'Banco de Dados', code: 'COMP123' },
  });

  const ihc = await prisma.discipline.create({
    data: { name: 'Interação Humano-Computador', code: 'COMP234' },
  });

  const es = await prisma.discipline.create({
    data: { name: 'Engenharia de Software', code: 'COMP345' },
  });

  const ed = await prisma.discipline.create({
    data: { name: 'Estrutura de Dados', code: 'COMP456' },
  });

  // Teachers
  const t1 = await prisma.teacher.create({
    data: {
      name: 'João Carlos Ribeiro',
      title: 'Prof. Dr.',
      disciplines: { connect: [{ id: bd.id }, { id: es.id }] },
    },
  });

  const t2 = await prisma.teacher.create({
    data: {
      name: 'Ana Paula Martins',
      title: 'Profa. Me.',
      disciplines: { connect: [{ id: ihc.id }] },
    },
  });

  const t3 = await prisma.teacher.create({
    data: {
      name: 'Marcos Silva',
      title: 'Prof.',
      disciplines: { connect: [{ id: ed.id }] },
    },
  });

  // Evaluation
  const eval1 = await prisma.evaluation.create({
    data: {
      comment: 'Explica muito bem, mas as listas são puxadas.',
      disciplineId: bd.id,
      teacherId: t1.id,
      userId: student.id,
      scores: {
        create: [
          { criterionId: 'didatica', note: 5 },
          { criterionId: 'assiduidade', note: 4 },
          { criterionId: 'claridade', note: 4 },
          { criterionId: 'postura', note: 5 },
        ],
      },
    },
  });

  const eval2 = await prisma.evaluation.create({
    data: {
      comment: 'Aulas bem dinâmicas, muitos exemplos práticos.',
      disciplineId: ihc.id,
      teacherId: t2.id,
      userId: student.id,
      scores: {
        create: [
          { criterionId: 'didatica', note: 5 },
          { criterionId: 'assiduidade', note: 5 },
          { criterionId: 'claridade', note: 5 },
          { criterionId: 'postura', note: 5 },
        ],
      },
    },
  });

  console.log('🌱 Seed executado com sucesso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
