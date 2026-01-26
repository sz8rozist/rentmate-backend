import { ApiProperty } from '@nestjs/swagger';

export class MessageAttachmentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  url: string;
}