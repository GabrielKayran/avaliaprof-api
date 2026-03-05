import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../common/pagination';
import { TeacherWithDisciplinesAndAverageResponseDto } from './teacher-with-disciplines-and-average-response.dto';

export class TeacherWithAveragePaginationResponse extends PaginationResponse<TeacherWithDisciplinesAndAverageResponseDto> {
  @ApiProperty({
    description: 'Array de professores com disciplinas e média de avaliação',
    type: [TeacherWithDisciplinesAndAverageResponseDto],
  })
  data: TeacherWithDisciplinesAndAverageResponseDto[];
}
