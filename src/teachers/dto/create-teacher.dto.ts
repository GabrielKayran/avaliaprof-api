import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
export class CreateTeacherDto {
  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ example: 'Doutor', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}
