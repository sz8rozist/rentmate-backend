import { IsEnum, IsInt, IsString } from 'class-validator';

export enum FlatStatus {
  available = 'available',
  rented = 'rented',
}

export class CreateFlatDto {
  @IsString()
  address: string;

  @IsInt()
  price: number;

  @IsEnum(FlatStatus)
  status: FlatStatus;

  @IsInt()
  landlordId: number;
}
