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
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Doutor', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: ['uuid-disciplina-1', 'uuid-disciplina-2'],
    description: 'Array de IDs das disciplinas que este professor leciona',
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  disciplineIds?: string[];
}
