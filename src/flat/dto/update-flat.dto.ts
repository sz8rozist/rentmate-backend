import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { FlatStatus } from './create-flat.dto';

export class UpdateFlatDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsEnum(FlatStatus)
  status?: FlatStatus;
}
