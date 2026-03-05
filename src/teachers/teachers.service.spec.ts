import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

type PrismaMock = {
  teacher: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  evaluationScore: {
    deleteMany: jest.Mock;
  };
  evaluation: {
    deleteMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('TeachersService', () => {
  let service: TeachersService;
  let prisma: jest.Mocked<PrismaMock>;

  const mockTeacher = {
    id: 'teacher-1',
    name: 'Dr. João Silva',
    title: 'Doutor',
  };

  const mockCreateDto = {
    name: 'Dr. João Silva',
    title: 'Doutor',
  };

  const mockUpdateDto = {
    name: 'Dr. João Santos',
    title: 'Mestre',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: PrismaService,
          useValue: {
            teacher: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            evaluationScore: { deleteMany: jest.fn() },
            evaluation: { deleteMany: jest.fn() },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
    prisma = module.get(PrismaService);
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
  });

  describe('create', () => {
    it('should create teacher successfully with title', async () => {
      prisma.teacher.create.mockResolvedValue({
        id: 'teacher-1',
        ...mockCreateDto,
        disciplines: [],
      } as any);

      const result = await service.create(mockCreateDto as any);

      expect(prisma.teacher.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockCreateDto,
        }),
      );
      expect(result.id).toBe('teacher-1');
      expect(result.name).toBe('Dr. João Silva');
    });

    it('should create teacher successfully without title', async () => {
      const dtoWithoutTitle = { name: 'Dr. Maria Silva' };
      prisma.teacher.create.mockResolvedValue({
        id: 'teacher-2',
        ...dtoWithoutTitle,
        title: null,
        disciplines: [],
      } as any);

      const result = await service.create(dtoWithoutTitle as any);

      expect(prisma.teacher.create).toHaveBeenCalled();
      expect(result.id).toBe('teacher-2');
      expect(result.name).toBe('Dr. Maria Silva');
    });
  });

  describe('findAll', () => {
    it('should return paginated teachers', async () => {
      const mockTeachers = [
        { id: 'teacher-1', name: 'Dr. João Silva', title: 'Doutor' },
        { id: 'teacher-2', name: 'Dr. Maria Silva', title: 'Mestre' },
      ];

      prisma.teacher.findMany.mockResolvedValue(mockTeachers as any);
      prisma.teacher.count.mockResolvedValue(2);

      const pagination = { page: 1, limit: 10 };
      const result = await service.findAll(pagination as any);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should use default pagination when not provided', async () => {
      prisma.teacher.findMany.mockResolvedValue([mockTeacher] as any);
      prisma.teacher.count.mockResolvedValue(1);

      const result = await service.findAll(undefined);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should calculate correct skip and take for page 2', async () => {
      prisma.teacher.findMany.mockResolvedValue([] as any);
      prisma.teacher.count.mockResolvedValue(25);

      const pagination = { page: 2, limit: 10 };
      await service.findAll(pagination as any);

      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });

    it('should order teachers by name', async () => {
      prisma.teacher.findMany.mockResolvedValue([] as any);
      prisma.teacher.count.mockResolvedValue(0);

      await service.findAll(undefined);

      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { name: 'asc' },
        }),
      );
    });
  });

  describe('findAllWithAverage', () => {
    it('deve retornar professores com disciplinas e média de avaliação', async () => {
      const mockTeachers = [
        {
          id: 'teacher-1',
          name: 'Dr. João Silva',
          title: 'Doutor',
          disciplines: [{ id: 'disc-1', name: 'Cálculo I', code: 'CALC001' }],
          evaluations: [
            {
              id: 'eval-1',
              scores: [
                {
                  id: 's1',
                  criterionId: 'didatica',
                  note: 5,
                  evaluationId: 'eval-1',
                },
                {
                  id: 's2',
                  criterionId: 'assiduidade',
                  note: 3,
                  evaluationId: 'eval-1',
                },
              ],
            },
            {
              id: 'eval-2',
              scores: [
                {
                  id: 's3',
                  criterionId: 'didatica',
                  note: 4,
                  evaluationId: 'eval-2',
                },
                {
                  id: 's4',
                  criterionId: 'assiduidade',
                  note: 4,
                  evaluationId: 'eval-2',
                },
              ],
            },
          ],
        },
      ];

      prisma.teacher.findMany.mockResolvedValue(mockTeachers as any);
      prisma.teacher.count.mockResolvedValue(1);

      const pagination = { page: 1, limit: 10 };
      const result = await service.findAllWithAverage(pagination as any);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].name).toBe('Dr. João Silva');
      expect(result.data[0].disciplines).toHaveLength(1);
      expect(result.data[0].averageScore).toBe(4);
      expect(result.data[0].totalEvaluations).toBe(2);
    });

    it('deve usar paginação padrão quando não fornecida', async () => {
      prisma.teacher.findMany.mockResolvedValue([] as any);
      prisma.teacher.count.mockResolvedValue(0);

      const result = await service.findAllWithAverage(undefined);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('deve retornar média 0 quando professor não tem avaliações', async () => {
      const mockTeachers = [
        {
          id: 'teacher-1',
          name: 'Dr. João Silva',
          title: 'Doutor',
          disciplines: [],
          evaluations: [],
        },
      ];

      prisma.teacher.findMany.mockResolvedValue(mockTeachers as any);
      prisma.teacher.count.mockResolvedValue(1);

      const result = await service.findAllWithAverage({
        page: 1,
        limit: 10,
      } as any);

      expect(result.data[0].averageScore).toBe(0);
      expect(result.data[0].totalEvaluations).toBe(0);
    });

    it('deve ordenar professores por nome', async () => {
      prisma.teacher.findMany.mockResolvedValue([] as any);
      prisma.teacher.count.mockResolvedValue(0);

      await service.findAllWithAverage(undefined);

      expect(prisma.teacher.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { name: 'asc' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a teacher by id', async () => {
      prisma.teacher.findUnique.mockResolvedValue(mockTeacher as any);

      const result = await service.findOne('teacher-1');

      expect(result).toEqual(mockTeacher);
      expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
        where: { id: 'teacher-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if teacher does not exist', async () => {
      prisma.teacher.findUnique.mockResolvedValue(null);

      await expect(service.findOne('teacher-999')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should include disciplines in response', async () => {
      const teacherWithDisciplines = {
        ...mockTeacher,
        disciplines: [{ id: 'disc-1', name: 'Cálculo I', code: 'CALC001' }],
        evaluations: [],
      };

      prisma.teacher.findUnique.mockResolvedValue(
        teacherWithDisciplines as any,
      );

      const result = await service.findOne('teacher-1');

      expect(result.disciplines).toHaveLength(1);
      expect(result.disciplines.length > 0 && result.disciplines[0].name).toBe(
        'Cálculo I',
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if teacher does not exist', async () => {
      prisma.teacher.findUnique.mockResolvedValue(null);

      await expect(
        service.update('teacher-999', mockUpdateDto as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update teacher successfully', async () => {
      prisma.teacher.findUnique.mockResolvedValue(mockTeacher as any);
      prisma.teacher.update.mockResolvedValue({
        ...mockTeacher,
        ...mockUpdateDto,
      } as any);

      const result = await service.update('teacher-1', mockUpdateDto as any);

      expect(prisma.teacher.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'teacher-1' },
          data: mockUpdateDto,
        }),
      );
      expect(result.name).toBe(mockUpdateDto.name);
    });

    it('should update only name when title is not provided', async () => {
      const updateNameOnlyDto = { name: 'Dr. Novo Nome' };
      prisma.teacher.findUnique.mockResolvedValue(mockTeacher as any);
      prisma.teacher.update.mockResolvedValue({
        ...mockTeacher,
        ...updateNameOnlyDto,
      } as any);

      const result = await service.update(
        'teacher-1',
        updateNameOnlyDto as any,
      );

      expect(result.name).toBe(updateNameOnlyDto.name);
    });

    it('should update only title when name is not provided', async () => {
      const updateTitleOnlyDto = { title: 'Professor Associado' };
      prisma.teacher.findUnique.mockResolvedValue(mockTeacher as any);
      prisma.teacher.update.mockResolvedValue({
        ...mockTeacher,
        ...updateTitleOnlyDto,
      } as any);

      const result = await service.update(
        'teacher-1',
        updateTitleOnlyDto as any,
      );

      expect(result.title).toBe(updateTitleOnlyDto.title);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if teacher does not exist', async () => {
      prisma.teacher.findUnique.mockResolvedValue(null);

      await expect(service.remove('teacher-999')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should delete teacher successfully', async () => {
      prisma.teacher.findUnique.mockResolvedValue(mockTeacher as any);
      prisma.teacher.delete.mockResolvedValue(mockTeacher as any);

      const result = await service.remove('teacher-1');

      expect(prisma.teacher.delete).toHaveBeenCalledWith({
        where: { id: 'teacher-1' },
      });
      expect(result.id).toBe('teacher-1');
    });
  });
});
