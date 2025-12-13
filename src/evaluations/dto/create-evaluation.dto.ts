import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';

export class CriterionScoreDto {
  @ApiProperty({ example: 'didatica' })
  @IsString()
  criterionId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  note: number;
}

export class CreateEvaluationDto {
  @ApiProperty({ example: 'uuid-da-disciplina' })
  @IsString()
  disciplineId: string;

  @ApiProperty({ example: 'uuid-do-professor' })
  @IsString()
  teacherId: string;

  @ApiProperty({
    example: 'Explica muito bem, mas as provas são difíceis.',
  })
  @IsString()
  comment: string;

  @ApiProperty({ type: [CriterionScoreDto] })
  @IsArray()
  scores: CriterionScoreDto[];
}
