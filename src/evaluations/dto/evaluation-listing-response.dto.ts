import { ApiProperty } from '@nestjs/swagger';
import {
  TeacherResponseDto,
  DisciplineResponseDto,
  EvaluationScoreResponseDto,
  UserResponseDto,
} from './evaluation-response.dto';

export class EvaluationListingResponseDto {
  @ApiProperty({
    example: 'uuid-da-avaliacao',
    description: 'ID único da avaliação',
  })
  id: string;

  @ApiProperty({
    example: 'Excelente professor, explica muito bem!',
    description: 'Comentário sobre a avaliação',
  })
  comment: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de criação da avaliação',
  })
  createdAt: string;

  @ApiProperty({ type: TeacherResponseDto, description: 'Professor avaliado' })
  teacher: TeacherResponseDto;

  @ApiProperty({
    type: DisciplineResponseDto,
    description: 'Disciplina avaliada',
  })
  discipline: DisciplineResponseDto;

  @ApiProperty({
    type: [EvaluationScoreResponseDto],
    description: 'Notas por critério',
  })
  scores: EvaluationScoreResponseDto[];

  @ApiProperty({
    example: 4.25,
    description: 'Média geral das notas desta avaliação',
  })
  averageScore: number;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuário que fez a avaliação',
  })
  user: UserResponseDto;
}
