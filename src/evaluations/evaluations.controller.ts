import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

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
  })
  findMine(@CurrentUser() user: User) {
    return this.service.findMine(user);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({
    summary: 'Avaliações de um professor',
  })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.service.findByTeacher(teacherId);
  }

  @Get('teacher/:teacherId/average')
  @ApiOperation({
    summary: 'Média de avaliações por critério',
  })
  getAverage(@Param('teacherId') teacherId: string) {
    return this.service.getTeacherAverage(teacherId);
  }
}
