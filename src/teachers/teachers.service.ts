import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResponse } from '../common/pagination';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeacherDto) {
    if (dto.disciplineIds && dto.disciplineIds.length > 0) {
      const existingDisciplines = await this.prisma.discipline.findMany({
        where: { id: { in: dto.disciplineIds } },
        select: { id: true },
      });

      if (existingDisciplines.length !== dto.disciplineIds.length) {
        throw new BadRequestException(
          'Uma ou mais disciplinas não foram encontradas',
        );
      }
    }

    return this.prisma.teacher.create({
      data: {
        name: dto.name,
        title: dto.title,
        disciplines: dto.disciplineIds
          ? {
              connect: dto.disciplineIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        disciplines: {
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
      this.prisma.teacher.findMany({
        include: {
          disciplines: {
            select: {
              id: true,
              name: true,
            },
          },
          evaluations: {
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
      this.prisma.teacher.count(),
    ]);

    return new PaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        disciplines: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        evaluations: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            disciplineId: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado');
    }

    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado');
    }

    if (dto.disciplineIds && dto.disciplineIds.length > 0) {
      const existingDisciplines = await this.prisma.discipline.findMany({
        where: { id: { in: dto.disciplineIds } },
        select: { id: true },
      });

      if (existingDisciplines.length !== dto.disciplineIds.length) {
        throw new BadRequestException(
          'Uma ou mais disciplinas não foram encontradas',
        );
      }
    }

    const updateData: any = {
      name: dto.name,
      title: dto.title,
    };

    if (dto.disciplineIds !== undefined) {
      updateData.disciplines = {
        set: [],
        connect: dto.disciplineIds.map((id) => ({ id })),
      };
    }

    return this.prisma.teacher.update({
      where: { id },
      data: updateData,
      include: {
        disciplines: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.evaluationScore.deleteMany({
        where: {
          evaluation: {
            teacherId: id,
          },
        },
      });

      await tx.evaluation.deleteMany({
        where: { teacherId: id },
      });

      return tx.teacher.delete({
        where: { id },
      });
    });
  }
}
