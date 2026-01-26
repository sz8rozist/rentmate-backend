import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString } from "class-validator";

export enum FlatStatus {
  available = "available",
  rented = "rented",
}

export class CreateFlatDto {
  @IsString()
  @ApiProperty()
  address: string;

  @IsInt()
  @ApiProperty()
  price: number;

  @IsEnum(FlatStatus)
  @ApiProperty()
  status: FlatStatus;

  @IsInt()
  @ApiProperty()
  landlordId: number;
}
