import { ApiProperty } from '@nestjs/swagger';

export class TeacherResponseDto {
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
}
