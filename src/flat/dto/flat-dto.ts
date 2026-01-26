import { ApiProperty } from "@nestjs/swagger";
import { FlatImageDto } from "./flat-image.dto";
import { FlatStatus } from "./create-flat.dto";

export class FlatDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ type: [FlatImageDto], required: false })
  images?: FlatImageDto[];

  @ApiProperty()
  status: FlatStatus;

  @ApiProperty()
  price: number;
}
