import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResponse } from '../common/pagination';

@Injectable()
export class DisciplinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDisciplineDto) {
    if (dto.code) {
      const disciplineExists = await this.prisma.discipline.findMany({
        where: { code: dto.code },
      });

      if (disciplineExists.length > 0) {
        throw new BadRequestException('Disciplina com este código já existe');
      }
    }

    if (dto.teacherIds && dto.teacherIds.length > 0) {
      const existingTeachers = await this.prisma.teacher.findMany({
        where: { id: { in: dto.teacherIds } },
        select: { id: true },
      });

      if (existingTeachers.length !== dto.teacherIds.length) {
        throw new BadRequestException(
          'Um ou mais professores não foram encontrados',
        );
      }
    }

    return this.prisma.discipline.create({
      data: {
        name: dto.name,
        code: dto.code,
        teachers: dto.teacherIds
          ? {
              connect: dto.teacherIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(pagination?: PaginationDto): Promise<PaginationResponse<any>> {
    const page = Number(pagination?.page || 1);
    const limit = Number(pagination?.limit || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.discipline.findMany({
        include: {
          teachers: {
            select: {
              id: true,
              name: true,
            },
          },
          Evaluation: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.discipline.count(),
    ]);

    return new PaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
        },
        Evaluation: {
          select: {
            id: true,
            teacherId: true,
            userId: true,
          },
        },
      },
    });

    if (!discipline) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return discipline;
  }

  async update(id: string, dto: UpdateDisciplineDto) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
    });

    if (!discipline) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    if (dto.code && dto.code !== discipline.code) {
      const codeExists = await this.prisma.discipline.findMany({
        where: { code: dto.code },
      });

      if (codeExists.length > 0) {
        throw new BadRequestException('Este código de disciplina já existe');
      }
    }

    if (dto.teacherIds && dto.teacherIds.length > 0) {
      const existingTeachers = await this.prisma.teacher.findMany({
        where: { id: { in: dto.teacherIds } },
        select: { id: true },
      });

      console.log(existingTeachers);

      if (existingTeachers.length !== dto.teacherIds.length) {
        throw new BadRequestException(
          'Um ou mais professores não foram encontrados',
        );
      }
    }

    const updateData: any = {
      name: dto.name,
      code: dto.code,
    };

    if (dto.teacherIds !== undefined) {
      updateData.teachers = {
        set: [],
        connect: dto.teacherIds.map((id) => ({ id })),
      };
    }

    return this.prisma.discipline.update({
      where: { id },
      data: updateData,
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
    });

    if (!discipline) {
      throw new NotFoundException('Disciplina não encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.evaluationScore.deleteMany({
        where: {
          evaluation: {
            disciplineId: id,
          },
        },
      });

      await tx.evaluation.deleteMany({
        where: { disciplineId: id },
      });
      return tx.discipline.delete({
        where: { id },
      });
    });
  }
}
