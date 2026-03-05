import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @ApiProperty({ example: 'Doutor', required: false })
  @IsString({ message: 'O título deve ser um texto.' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: ['uuid-disciplina-1', 'uuid-disciplina-2'],
    description: 'Array de IDs das disciplinas que este professor leciona',
    required: false,
  })
  @IsArray({ message: 'disciplineIds deve ser um array.' })
  @IsUUID('all', {
    each: true,
    message: 'Um ou mais IDs de disciplina são inválidos.',
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  disciplineIds?: string[];
}
