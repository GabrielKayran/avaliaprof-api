import { Test, TestingModule } from '@nestjs/testing';
import { DisciplinesService } from './disciplines.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

type PrismaMock = {
  discipline: {
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

describe('DisciplinesService', () => {
  let service: DisciplinesService;
  let prisma: jest.Mocked<PrismaMock>;

  const mockDiscipline = {
    id: 'disc-1',
    name: 'Cálculo I',
    code: 'CALC001',
  };

  const mockCreateDto = {
    name: 'Cálculo I',
    code: 'CALC001',
  };

  const mockUpdateDto = {
    name: 'Cálculo Diferencial',
    code: 'CALC002',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinesService,
        {
          provide: PrismaService,
          useValue: {
            discipline: {
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

    service = module.get<DisciplinesService>(DisciplinesService);
    prisma = module.get(PrismaService);
    prisma.$transaction.mockImplementation(async (cb) => cb(prisma));
  });

  describe('create', () => {
    it('should throw BadRequestException if code already exists', async () => {
      prisma.discipline.findMany.mockResolvedValue([mockDiscipline] as any);

      await expect(service.create(mockCreateDto as any)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should create discipline successfully without code', async () => {
      const dtoWithoutCode = { name: 'Cálculo I' };
      prisma.discipline.create.mockResolvedValue({
        id: 'disc-1',
        ...dtoWithoutCode,
        code: null,
        teachers: [],
      } as any);

      const result = await service.create(dtoWithoutCode as any);

      expect(prisma.discipline.create).toHaveBeenCalled();
      expect(result.id).toBe('disc-1');
      expect(result.name).toBe('Cálculo I');
    });

    it('should create discipline successfully with code', async () => {
      prisma.discipline.findMany.mockResolvedValue([] as any);
      prisma.discipline.create.mockResolvedValue({
        id: 'disc-1',
        ...mockCreateDto,
        teachers: [],
      } as any);

      const result = await service.create(mockCreateDto as any);

      expect(prisma.discipline.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockCreateDto,
        }),
      );
      expect(result.id).toBe('disc-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated disciplines', async () => {
      const mockDisciplines = [
        { id: 'disc-1', name: 'Cálculo I', code: 'CALC001' },
        { id: 'disc-2', name: 'Cálculo II', code: 'CALC002' },
      ];

      prisma.discipline.findMany.mockResolvedValue(mockDisciplines as any);
      prisma.discipline.count.mockResolvedValue(2);

      const pagination = { page: 1, limit: 10 };
      const result = await service.findAll(pagination as any);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(prisma.discipline.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should use default pagination when not provided', async () => {
      prisma.discipline.findMany.mockResolvedValue([mockDiscipline] as any);
      prisma.discipline.count.mockResolvedValue(1);

      const result = await service.findAll(undefined);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(prisma.discipline.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should calculate correct skip and take for page 2', async () => {
      prisma.discipline.findMany.mockResolvedValue([] as any);
      prisma.discipline.count.mockResolvedValue(25);

      const pagination = { page: 2, limit: 10 };
      await service.findAll(pagination as any);

      expect(prisma.discipline.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a discipline by id', async () => {
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);

      const result = await service.findOne('disc-1');

      expect(result).toEqual(mockDiscipline);
      expect(prisma.discipline.findUnique).toHaveBeenCalledWith({
        where: { id: 'disc-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if discipline does not exist', async () => {
      prisma.discipline.findUnique.mockResolvedValue(null);

      await expect(service.findOne('disc-999')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if discipline does not exist', async () => {
      prisma.discipline.findUnique.mockResolvedValue(null);

      await expect(
        service.update('disc-999', mockUpdateDto as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw BadRequestException if new code already exists', async () => {
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);
      prisma.discipline.findMany.mockResolvedValue([
        { id: 'disc-2', code: mockUpdateDto.code },
      ] as any);

      await expect(
        service.update('disc-1', mockUpdateDto as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should update discipline successfully', async () => {
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);
      prisma.discipline.findMany.mockResolvedValue([] as any);
      prisma.discipline.update.mockResolvedValue({
        ...mockDiscipline,
        ...mockUpdateDto,
      } as any);

      const result = await service.update('disc-1', mockUpdateDto as any);

      expect(prisma.discipline.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'disc-1' },
          data: mockUpdateDto,
        }),
      );
      expect(result.name).toBe(mockUpdateDto.name);
    });

    it('should allow keeping the same code', async () => {
      const sameCodeDto = { name: 'Novo Nome', code: 'CALC001' };
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);
      prisma.discipline.update.mockResolvedValue({
        ...mockDiscipline,
        name: sameCodeDto.name,
      } as any);

      const result = await service.update('disc-1', sameCodeDto as any);

      expect(prisma.discipline.update).toHaveBeenCalled();
      expect(result.name).toBe(sameCodeDto.name);
    });

    it('should update only name when code is not provided', async () => {
      const updateNameOnlyDto = { name: 'Novo Nome' };
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);
      prisma.discipline.update.mockResolvedValue({
        ...mockDiscipline,
        ...updateNameOnlyDto,
      } as any);

      const result = await service.update('disc-1', updateNameOnlyDto as any);

      expect(result.name).toBe(updateNameOnlyDto.name);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if discipline does not exist', async () => {
      prisma.discipline.findUnique.mockResolvedValue(null);

      await expect(service.remove('disc-999')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should delete discipline successfully', async () => {
      prisma.discipline.findUnique.mockResolvedValue(mockDiscipline as any);
      prisma.discipline.delete.mockResolvedValue(mockDiscipline as any);

      const result = await service.remove('disc-1');

      expect(prisma.discipline.delete).toHaveBeenCalledWith({
        where: { id: 'disc-1' },
      });
      expect(result.id).toBe('disc-1');
    });
  });
});
