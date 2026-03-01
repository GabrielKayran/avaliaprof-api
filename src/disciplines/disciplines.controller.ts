import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { DisciplineResponseDto } from './dto/discipline-response.dto';
import { DisciplinePaginationResponse } from './dto/discipline-pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/pagination';

@ApiTags('Disciplines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly service: DisciplinesService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar disciplina',
    description: 'Cria uma nova disciplina no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Disciplina criada com sucesso',
    type: DisciplineResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou disciplina já existe',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  create(@Body() dto: CreateDisciplineDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as disciplinas',
    description: 'Retorna uma lista paginada de todas as disciplinas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de disciplinas retornada com sucesso',
    type: DisciplinePaginationResponse,
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter disciplina por ID',
    description: 'Retorna os detalhes de uma disciplina específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina encontrada com sucesso',
    type: DisciplineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar disciplina',
    description: 'Atualiza os dados de uma disciplina existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina atualizada com sucesso',
    type: DisciplineResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  update(@Param('id') id: string, @Body() dto: UpdateDisciplineDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar disciplina',
    description: 'Remove uma disciplina do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Disciplina possui avaliações associadas',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
