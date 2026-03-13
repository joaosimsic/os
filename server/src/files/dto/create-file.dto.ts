import { IsString, IsOptional, IsBoolean, IsInt, MaxLength, IsIn } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(['text', 'image', 'link', 'note'])
  type: string;

  @IsString()
  @MaxLength(50000) // ~50KB of text
  content: string;

  @IsString()
  @IsOptional()
  folderId?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsInt()
  @IsOptional()
  positionX?: number;

  @IsInt()
  @IsOptional()
  positionY?: number;
}
