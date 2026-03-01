import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import {
  EvaluationResponseDto,
  EvaluationWithUserResponseDto,
  TeacherAverageResponseDto,
} from './dto/evaluation-response.dto';
import {
  TopTeachersResponseDto,
  MetricsResponseDto,
  GradeDistributionResponseDto,
  GradeDistributionDto,
} from './dto/evaluation-stats.dto';
import {
  User,
  Evaluation,
  Teacher,
  Discipline,
  EvaluationScore,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto, PaginationResponse } from '../common/pagination';

type EvaluationWithRelations = Evaluation & {
  teacher: Teacher;
  discipline: Discipline;
  scores: EvaluationScore[];
};

type EvaluationWithTeacherAndUser = Evaluation & {
  discipline: Discipline;
  scores: EvaluationScore[];
  user: {
    id: string;
    name: string;
  };
};

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  private toEvaluationResponseDto(
    evaluation: EvaluationWithRelations,
  ): EvaluationResponseDto {
    return {
      id: evaluation.id,
      comment: evaluation.comment,
      createdAt: evaluation.createdAt.toISOString(),
      discipline: {
        id: evaluation.discipline.id,
        name: evaluation.discipline.name,
        code: evaluation.discipline.code,
      },
      teacher: {
        id: evaluation.teacher.id,
        name: evaluation.teacher.name,
        title: evaluation.teacher.title,
      },
      scores: evaluation.scores.map((score) => ({
        criterionId: score.criterionId,
        note: score.note,
      })),
    };
  }

  private toEvaluationWithUserResponseDto(
    evaluation: EvaluationWithTeacherAndUser,
  ): EvaluationWithUserResponseDto {
    return {
      id: evaluation.id,
      comment: evaluation.comment,
      createdAt: evaluation.createdAt.toISOString(),
      discipline: {
        id: evaluation.discipline.id,
        name: evaluation.discipline.name,
        code: evaluation.discipline.code,
      },
      scores: evaluation.scores.map((score) => ({
        criterionId: score.criterionId,
        note: score.note,
      })),
      user: {
        id: evaluation.user.id,
        name: evaluation.user.name,
      },
    };
  }

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
  ): Promise<PaginationResponse<EvaluationResponseDto>> {
    const page = Number(pagination?.page || 1);
    const limit = Number(pagination?.limit || 10);
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

    return new PaginationResponse(
      data.map((evaluation) => this.toEvaluationResponseDto(evaluation)),
      total,
      page,
      limit,
    );
  }

  async findByTeacher(
    teacherId: string,
    pagination?: PaginationDto,
  ): Promise<PaginationResponse<EvaluationWithUserResponseDto>> {
    const page = Number(pagination?.page || 1);
    const limit = Number(pagination?.limit || 10);
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

    return new PaginationResponse(
      data.map((evaluation) =>
        this.toEvaluationWithUserResponseDto(evaluation),
      ),
      total,
      page,
      limit,
    );
  }

  async getTeacherAverage(
    teacherId: string,
  ): Promise<TeacherAverageResponseDto[]> {
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

  async getTopTeachers(): Promise<TopTeachersResponseDto> {
    const evaluationsWithTeachers = await this.prisma.evaluation.findMany({
      where: {
        teacherId: {
          not: '',
        },
      },
      include: {
        scores: true,
        teacher: true,
      },
    });

    const teacherMap = new Map<string, { name: string; scores: number[] }>();

    evaluationsWithTeachers.forEach((evaluation) => {
      if (!evaluation.teacher) return;

      const teacherId = evaluation.teacherId;
      const existing = teacherMap.get(teacherId);

      if (existing) {
        existing.scores.push(...evaluation.scores.map((s) => s.note));
      } else {
        teacherMap.set(teacherId, {
          name: evaluation.teacher.name,
          scores: evaluation.scores.map((s) => s.note),
        });
      }
    });

    const teachersWithAverage = Array.from(teacherMap.entries())
      .map(([_id, data]) => {
        if (data.scores.length === 0) return null;

        const average =
          data.scores.reduce((sum, score) => sum + score, 0) /
          data.scores.length;

        return {
          name: data.name,
          average: Number(average.toFixed(2)),
        };
      })
      .filter(
        (teacher): teacher is NonNullable<typeof teacher> => teacher !== null,
      )
      .sort((a, b) => b.average - a.average)
      .slice(0, 10) // Top 10 teachers
      .map((teacher, index) => ({
        ...teacher,
        position: index + 1,
      }));

    return {
      teachers: teachersWithAverage,
    };
  }

  async getGeneralMetrics(): Promise<MetricsResponseDto> {
    const criteria = ['didatica', 'assiduidade', 'claridade', 'postura'];

    const metricsPromises = criteria.map(async (criterionId) => {
      const result = await this.prisma.evaluationScore.groupBy({
        by: ['criterionId'],
        where: {
          criterionId,
        },
        _avg: {
          note: true,
        },
      });

      return {
        criterionId,
        average:
          result.length > 0 ? Number(result[0]._avg.note?.toFixed(2)) : 0,
      };
    });

    const metrics = await Promise.all(metricsPromises);

    const generalAverage =
      metrics.reduce((sum, metric) => sum + metric.average, 0) / metrics.length;

    return {
      metrics,
      generalAverage: Number(generalAverage.toFixed(2)),
    };
  }

  async getGradeDistribution(): Promise<GradeDistributionResponseDto> {
    const scores = await this.prisma.evaluationScore.groupBy({
      by: ['note'],
      _count: {
        note: true,
      },
    });

    const distribution: GradeDistributionDto = {
      criterionId: 'all',
      grade5: 0,
      grade4: 0,
      grade3: 0,
      grade2: 0,
      grade1: 0,
    };

    scores.forEach((score) => {
      const gradeKey = `grade${score.note}` as keyof Omit<
        typeof distribution,
        'criterionId'
      >;
      distribution[gradeKey] = score._count.note;
    });

    return {
      distribution: [distribution],
    };
  }
}
