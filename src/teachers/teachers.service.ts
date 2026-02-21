import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResponse } from '../common/pagination';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        name: dto.name,
        title: dto.title,
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
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
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

    return this.prisma.teacher.update({
      where: { id },
      data: {
        name: dto.name,
        title: dto.title,
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

  async remove(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado');
    }

    return this.prisma.teacher.delete({
      where: { id },
    });
  }
}
