import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

export enum CriterionEnum {
  DIDATICA = 'didatica',
  ASSIDUIDADE = 'assiduidade',
  CLARIDADE = 'claridade',
  POSTURA = 'postura',
}

export class CriterionScoreDto {
  @ApiProperty({ example: 'didatica', enum: CriterionEnum })
  @IsEnum(CriterionEnum, {
    message:
      'Critério inválido. Valores aceitos: didatica, assiduidade, claridade, postura.',
  })
  criterionId: CriterionEnum;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: 'A nota deve ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  note: number;
}

export class CreateEvaluationDto {
  @ApiProperty({ example: 'uuid-da-disciplina' })
  @IsString({ message: 'O ID da disciplina deve ser um texto.' })
  disciplineId: string;

  @ApiProperty({ example: 'uuid-do-professor' })
  @IsString({ message: 'O ID do professor deve ser um texto.' })
  teacherId: string;

  @ApiProperty({
    example: 'Explica muito bem, mas as provas são difíceis.',
  })
  @IsString({ message: 'O comentário deve ser um texto.' })
  comment: string;

  @ApiProperty({ type: [CriterionScoreDto] })
  @IsArray({ message: 'As notas devem ser enviadas como um array.' })
  scores: CriterionScoreDto[];
}
