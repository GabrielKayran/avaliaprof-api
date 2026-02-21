import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDisciplineDto {
  @ApiProperty({ example: 'Cálculo I' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CALC001', required: false })
  @IsString()
  @IsOptional()
  code?: string;
}
