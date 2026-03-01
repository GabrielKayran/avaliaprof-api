import { ApiProperty } from '@nestjs/swagger';
import { TeacherResponseDto } from '../../teachers/dto/teacher-response.dto';

export class DisciplineResponseDto {
  @ApiProperty({
    example: 'uuid-da-disciplina',
    description: 'ID único da disciplina',
  })
  id: string;

  @ApiProperty({ example: 'Cálculo I', description: 'Nome da disciplina' })
  name: string;

  @ApiProperty({
    example: 'CAL001',
    description: 'Código da disciplina',
    required: false,
  })
  code?: string;

  @ApiProperty({
    type: [TeacherResponseDto],
    description: 'Professores que lecionam esta disciplina',
  })
  teachers: TeacherResponseDto[];
}
