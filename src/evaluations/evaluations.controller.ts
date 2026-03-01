import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { TeacherAverageResponseDto } from './dto/evaluation-response.dto';
import {
  TopTeachersResponseDto,
  MetricsResponseDto,
  GradeDistributionResponseDto,
} from './dto/evaluation-stats.dto';
import { EvaluationPaginationResponse } from './dto/evaluation-pagination-response.dto';
import { EvaluationWithUserPaginationResponse } from './dto/evaluation-with-user-pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { PaginationDto } from '../common/pagination';

@ApiTags('Evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar avaliação',
    description: 'Aluno avalia um professor',
  })
  @ApiResponse({ status: 201 })
  create(@CurrentUser() user: User, @Body() dto: CreateEvaluationDto) {
    return this.service.create(user, dto);
  }

  @Get('my')
  @ApiOperation({
    summary: 'Minhas avaliações',
    description: 'Lista todas as avaliações feitas pelo usuário logado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações do usuário',
    type: EvaluationPaginationResponse,
  })
  findMine(@CurrentUser() user: User, @Query() pagination: PaginationDto) {
    return this.service.findMine(user, pagination);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Avaliações de um professor',
    description: 'Lista todas as avaliações de um professor específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações do professor',
    type: EvaluationWithUserPaginationResponse,
  })
  findByTeacher(
    @Param('teacherId') teacherId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByTeacher(teacherId, pagination);
  }

  @Get('teacher/:teacherId/average')
  @ApiOperation({
    summary: 'Média de avaliações por critério',
    description:
      'Retorna a média das notas de um professor agrupada por critério',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de médias por critério',
    type: [TeacherAverageResponseDto],
  })
  getAverage(@Param('teacherId') teacherId: string) {
    return this.service.getTeacherAverage(teacherId);
  }

  @Get('stats/top-teachers')
  @ApiOperation({
    summary: 'Top 6 professores com melhor média',
    description:
      'Retorna os 6 professores com melhor média geral, ordenados do maior para o menor',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista dos top 6 professores',
    type: TopTeachersResponseDto,
  })
  getTopTeachers() {
    return this.service.getTopTeachers();
  }

  @Get('stats/general-metrics')
  @ApiOperation({
    summary: 'Métricas gerais de avaliação',
    description:
      'Retorna as 5 métricas de avaliação com suas médias e a média geral',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas gerais com médias',
    type: MetricsResponseDto,
  })
  getGeneralMetrics() {
    return this.service.getGeneralMetrics();
  }

  @Get('stats/grade-distribution')
  @ApiOperation({
    summary: 'Distribuição de notas',
    description:
      'Retorna a quantidade total de cada nota (1 a 5) em todas as avaliações, independente do critério',
  })
  @ApiResponse({
    status: 200,
    description: 'Distribuição geral de notas',
    type: GradeDistributionResponseDto,
  })
  getGradeDistribution() {
    return this.service.getGradeDistribution();
  }
}
