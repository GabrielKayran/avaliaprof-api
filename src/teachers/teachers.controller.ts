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
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os professores',
  })
  @ApiResponse({ status: 200 })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter professor por ID',
  })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar professor',
  })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar professor',
  })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
