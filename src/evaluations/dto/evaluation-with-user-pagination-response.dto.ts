import { ApiProperty } from '@nestjs/swagger';
import { EvaluationWithUserResponseDto } from './evaluation-response.dto';
import { PaginationResponse } from '../../common/pagination';

export class EvaluationWithUserPaginationResponse extends PaginationResponse<EvaluationWithUserResponseDto> {
  @ApiProperty({
    description: 'Array de avaliações com dados do usuário',
    type: [EvaluationWithUserResponseDto],
  })
  data: EvaluationWithUserResponseDto[];
}
