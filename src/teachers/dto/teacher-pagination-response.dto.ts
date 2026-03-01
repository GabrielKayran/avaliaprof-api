import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../common/pagination';
import { TeacherWithDisciplinesResponseDto } from './teacher-with-disciplines-response.dto';

export class TeacherPaginationResponse extends PaginationResponse<TeacherWithDisciplinesResponseDto> {
  @ApiProperty({
    description: 'Array de professores',
    type: [TeacherWithDisciplinesResponseDto],
  })
  data: TeacherWithDisciplinesResponseDto[];
}
