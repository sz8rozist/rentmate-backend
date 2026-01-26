import { ApiProperty } from '@nestjs/swagger';

export class FlatImageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;
}
