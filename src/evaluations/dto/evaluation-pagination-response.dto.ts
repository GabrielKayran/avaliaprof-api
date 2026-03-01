import { ApiProperty } from '@nestjs/swagger';
import { EvaluationResponseDto } from './evaluation-response.dto';
import { PaginationResponse } from '../../common/pagination';

export class EvaluationPaginationResponse extends PaginationResponse<EvaluationResponseDto> {
  @ApiProperty({
    description: 'Array de avaliações',
    type: [EvaluationResponseDto],
  })
  data: EvaluationResponseDto[];
}
