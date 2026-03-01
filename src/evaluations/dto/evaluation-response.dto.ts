import { ApiProperty } from '@nestjs/swagger';

export class EvaluationScoreResponseDto {
  @ApiProperty({ example: 'didatica', description: 'ID do critério avaliado' })
  criterionId: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'Nota atribuída ao critério',
  })
  note: number;
}

export class TeacherResponseDto {
  @ApiProperty({
    example: 'uuid-do-professor',
    description: 'ID único do professor',
  })
  id: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do professor' })
  name: string;

  @ApiProperty({
    example: 'Doutor',
    description: 'Título acadêmico do professor',
    required: false,
  })
  title?: string;
}

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
}

export class UserResponseDto {
  @ApiProperty({
    example: 'uuid-do-usuario',
    description: 'ID único do usuário',
  })
  id: string;

  @ApiProperty({ example: 'Maria Santos', description: 'Nome do usuário' })
  name: string;
}

export class EvaluationResponseDto {
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

  @ApiProperty({
    type: DisciplineResponseDto,
    description: 'Disciplina avaliada',
  })
  discipline: DisciplineResponseDto;

  @ApiProperty({ type: TeacherResponseDto, description: 'Professor avaliado' })
  teacher: TeacherResponseDto;

  @ApiProperty({
    type: [EvaluationScoreResponseDto],
    description: 'Notas por critério',
  })
  scores: EvaluationScoreResponseDto[];
}

export class EvaluationWithUserResponseDto {
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
    type: UserResponseDto,
    description: 'Usuário que fez a avaliação',
  })
  user: UserResponseDto;
}

export class TeacherAverageResponseDto {
  @ApiProperty({ example: 'didatica', description: 'ID do critério' })
  criterionId: string;

  @ApiProperty({
    example: 4.5,
    description: 'Média das notas para este critério',
  })
  average: number;
}
