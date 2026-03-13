import { IsString, IsOptional, IsBoolean, IsInt, MaxLength, IsIn } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsIn(['text', 'image', 'link', 'note'])
  @IsOptional()
  type?: string;

  @IsString()
  @MaxLength(50000)
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  folderId?: string | null;

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
