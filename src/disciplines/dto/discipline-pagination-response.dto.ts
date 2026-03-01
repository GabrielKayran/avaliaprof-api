import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../common/pagination';
import { DisciplineResponseDto } from './discipline-response.dto';

export class DisciplinePaginationResponse extends PaginationResponse<DisciplineResponseDto> {
  @ApiProperty({
    description: 'Array de disciplinas',
    type: [DisciplineResponseDto],
  })
  data: DisciplineResponseDto[];
}
