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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherWithDisciplinesResponseDto } from './dto/teacher-with-disciplines-response.dto';
import { TeacherPaginationResponse } from './dto/teacher-pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/pagination';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly service: TeachersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar professor',
    description: 'Cria um novo professor no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Professor criado com sucesso',
    type: TeacherWithDisciplinesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou disciplinas não encontradas',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os professores',
    description: 'Retorna uma lista paginada de todos os professores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de professores retornada com sucesso',
    type: TeacherPaginationResponse,
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter professor por ID',
    description: 'Retorna os detalhes de um professor específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Professor encontrado com sucesso',
    type: TeacherWithDisciplinesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Professor não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar professor',
    description: 'Atualiza os dados de um professor existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Professor atualizado com sucesso',
    type: TeacherWithDisciplinesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Professor não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou disciplinas não encontradas',
  })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar professor',
    description: 'Remove um professor do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Professor deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Professor não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Professor possui avaliações associadas',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
