import { ApiProperty } from '@nestjs/swagger';

export class TopTeacherDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do professor' })
  name: string;

  @ApiProperty({ example: 4.62, description: 'Média geral de avaliação' })
  average: number;

  @ApiProperty({ example: 1, description: 'Posição no ranking' })
  position: number;
}

export class TopTeachersResponseDto {
  @ApiProperty({
    type: [TopTeacherDto],
    description: 'Lista dos top 6 professores',
  })
  teachers: TopTeacherDto[];
}

export class MetricDto {
  @ApiProperty({ example: 'didatica', description: 'ID do critério' })
  criterionId: string;

  @ApiProperty({ example: 4.22, description: 'Média do critério' })
  average: number;
}

export class MetricsResponseDto {
  @ApiProperty({
    type: [MetricDto],
    description: 'Lista das métricas com suas médias',
  })
  metrics: MetricDto[];

  @ApiProperty({
    example: 4.15,
    description: 'Média geral de todos os critérios',
  })
  generalAverage: number;
}

export class GradeDistributionDto {
  @ApiProperty({ example: 'didatica', description: 'ID do critério' })
  criterionId: string;

  @ApiProperty({ example: 20, description: 'Quantidade de notas 5' })
  grade5: number;

  @ApiProperty({ example: 15, description: 'Quantidade de notas 4' })
  grade4: number;

  @ApiProperty({ example: 10, description: 'Quantidade de notas 3' })
  grade3: number;

  @ApiProperty({ example: 8, description: 'Quantidade de notas 2' })
  grade2: number;

  @ApiProperty({ example: 5, description: 'Quantidade de notas 1' })
  grade1: number;
}

export class GradeDistributionResponseDto {
  @ApiProperty({
    type: [GradeDistributionDto],
    description: 'Distribuição de notas por critério',
  })
  distribution: GradeDistributionDto[];
}
