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
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CALC001', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: ['uuid-professor-1', 'uuid-professor-2'],
    description: 'Array de IDs dos professores que lecionam esta disciplina',
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  teacherIds?: string[];
}
