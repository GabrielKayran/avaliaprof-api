import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResponse } from '../common/pagination';

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, dto: CreateEvaluationDto) {
    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Apenas estudantes podem avaliar');
    }

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: dto.disciplineId },
    });

    if (!discipline) {
      throw new BadRequestException('Disciplina inválida');
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: { id: dto.teacherId },
    });

    if (!teacher) {
      throw new BadRequestException('Professor inválido');
    }

    return this.prisma.evaluation.create({
      data: {
        comment: dto.comment,
        disciplineId: dto.disciplineId,
        teacherId: dto.teacherId,
        userId: user.id,
        scores: {
          create: dto.scores,
        },
      },
      include: {
        scores: true,
      },
    });
  }

  async findMine(
    user: User,
    pagination?: PaginationDto,
  ): Promise<PaginationResponse<any>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.evaluation.findMany({
        where: {
          userId: user.id,
        },
        include: {
          teacher: true,
          discipline: true,
          scores: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.evaluation.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    return new PaginationResponse(data, total, page, limit);
  }

  async findByTeacher(
    teacherId: string,
    pagination?: PaginationDto,
  ): Promise<PaginationResponse<any>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.evaluation.findMany({
        where: { teacherId },
        include: {
          discipline: true,
          scores: true,
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.evaluation.count({
        where: { teacherId },
      }),
    ]);

    return new PaginationResponse(data, total, page, limit);
  }

  async getTeacherAverage(teacherId: string) {
    const scores = await this.prisma.evaluationScore.groupBy({
      by: ['criterionId'],
      where: {
        evaluation: {
          teacherId,
        },
      },
      _avg: {
        note: true,
      },
    });

    return scores.map((s) => ({
      criterionId: s.criterionId,
      average: Number(s._avg.note?.toFixed(2)),
    }));
  }
}
