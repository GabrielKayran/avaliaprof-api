import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationsService } from './evaluations.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User, Role } from '@prisma/client';

type PrismaMock = {
  discipline: {
    findUnique: jest.Mock;
  };
  teacher: {
    findUnique: jest.Mock;
  };
  evaluation: {
    create: jest.Mock;
    findMany: jest.Mock;
  };
  evaluationScore: {
    groupBy: jest.Mock;
  };
};

describe('EvaluationsService', () => {
  let service: EvaluationsService;
  let prisma: jest.Mocked<PrismaMock>;

  const mockUser: User = {
    id: 'user-1',
    name: 'Aluno Teste',
    email: 'teste@ufu.br',
    password: 'hashed',
    role: Role.STUDENT,
  };

  const mockDto = {
    disciplineId: 'disc-1',
    teacherId: 'teacher-1',
    comment: 'Muito bom',
    scores: [
      { criterionId: 'didatica', note: 5 },
      { criterionId: 'assiduidade', note: 4 },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationsService,
        {
          provide: PrismaService,
          useValue: {
            discipline: {
              findUnique: jest.fn(),
            },
            teacher: {
              findUnique: jest.fn(),
            },
            evaluation: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
            evaluationScore: {
              groupBy: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EvaluationsService>(EvaluationsService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not STUDENT', async () => {
      const adminUser = { ...mockUser, role: Role.ADMIN };

      await expect(
        service.create(adminUser, mockDto as any),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if discipline does not exist', async () => {
      prisma.discipline.findUnique.mockResolvedValue(null);

      await expect(
        service.create(mockUser, mockDto as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if teacher does not exist', async () => {
      prisma.discipline.findUnique.mockResolvedValue({ id: 'disc-1' } as any);
      prisma.teacher.findUnique.mockResolvedValue(null);

      await expect(
        service.create(mockUser, mockDto as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should create evaluation successfully', async () => {
      prisma.discipline.findUnique.mockResolvedValue({ id: 'disc-1' } as any);
      prisma.teacher.findUnique.mockResolvedValue({ id: 'teacher-1' } as any);

      prisma.evaluation.create.mockResolvedValue({
        id: 'eval-1',
        ...mockDto,
        userId: mockUser.id,
        scores: mockDto.scores,
      } as any);

      const result = await service.create(mockUser, mockDto as any);

      expect(prisma.evaluation.create).toHaveBeenCalled();
      expect(result.id).toBe('eval-1');
    });
  });

  describe('findMine', () => {
    it('should return evaluations of the user', async () => {
      prisma.evaluation.findMany.mockResolvedValue([{ id: 'eval-1' } as any]);

      const result = await service.findMine(mockUser);

      expect(result).toHaveLength(1);
      expect(prisma.evaluation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUser.id },
        }),
      );
    });
  });

  describe('findByTeacher', () => {
    it('should return evaluations for a teacher', async () => {
      prisma.evaluation.findMany.mockResolvedValue([{ id: 'eval-1' } as any]);

      const result = await service.findByTeacher('teacher-1');

      expect(result).toHaveLength(1);
      expect(prisma.evaluation.findMany).toHaveBeenCalled();
    });
  });

  describe('getTeacherAverage', () => {
    it('should return average score per criterion', async () => {
      prisma.evaluationScore.groupBy.mockResolvedValue([
        {
          criterionId: 'didatica',
          _avg: { note: 4.5 },
        },
      ] as any);

      const result = await service.getTeacherAverage('teacher-1');

      expect(result).toEqual([{ criterionId: 'didatica', average: 4.5 }]);
    });
  });
});
