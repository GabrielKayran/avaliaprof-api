import { ApiProperty } from '@nestjs/swagger';
import { EvaluationListingResponseDto } from './evaluation-listing-response.dto';
import { PaginationResponse } from '../../common/pagination';

export class EvaluationListingPaginationResponse extends PaginationResponse<EvaluationListingResponseDto> {
  @ApiProperty({
    description: 'Array de avaliações com dados completos para listagem',
    type: [EvaluationListingResponseDto],
  })
  data: EvaluationListingResponseDto[];
}
