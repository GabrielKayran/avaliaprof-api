import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDisciplineDto {
  @ApiProperty({ example: 'Cálculo I' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @ApiProperty({ example: 'CALC001', required: false })
  @IsString({ message: 'O código deve ser um texto.' })
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: ['uuid-professor-1', 'uuid-professor-2'],
    description: 'Array de IDs dos professores que lecionam esta disciplina',
    required: false,
  })
  @IsArray({ message: 'teacherIds deve ser um array.' })
  @IsUUID('all', {
    each: true,
    message: 'Um ou mais IDs de professor são inválidos.',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  teacherIds?: string[];
}
