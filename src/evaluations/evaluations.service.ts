import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

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

  async findMine(user: User) {
    return this.prisma.evaluation.findMany({
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
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.evaluation.findMany({
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
    });
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
