import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateComputerDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}
