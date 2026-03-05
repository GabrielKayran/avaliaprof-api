import { ApiProperty } from '@nestjs/swagger';
import { DisciplineResponseDto } from '../../disciplines/dto/discipline-response.dto';

export class TeacherWithDisciplinesAndAverageResponseDto {
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

  @ApiProperty({
    type: [DisciplineResponseDto],
    description: 'Disciplinas que este professor leciona',
  })
  disciplines: DisciplineResponseDto[];

  @ApiProperty({
    example: 4.35,
    description: 'Média geral das avaliações do professor',
  })
  averageScore: number;

  @ApiProperty({
    example: 12,
    description: 'Quantidade total de avaliações recebidas',
  })
  totalEvaluations: number;
}
