import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { FlatStatus } from "./create-flat.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFlatDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  price?: number;

  @IsOptional()
  @IsEnum(FlatStatus)
  @ApiProperty()
  status?: FlatStatus;
}
