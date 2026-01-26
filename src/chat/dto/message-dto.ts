import { ApiProperty } from '@nestjs/swagger';
import { MessageAttachmentDto } from './message-attachment-dto';

export class MessageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  flatId: number;

  @ApiProperty()
  senderId: number;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ type: [MessageAttachmentDto], required: false })
  messageAttachments?: MessageAttachmentDto[];
}