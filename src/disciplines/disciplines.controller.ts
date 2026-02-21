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
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateDisciplineDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as disciplinas',
  })
  @ApiResponse({ status: 200 })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter disciplina por ID',
  })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar disciplina',
  })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateDisciplineDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar disciplina',
  })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
