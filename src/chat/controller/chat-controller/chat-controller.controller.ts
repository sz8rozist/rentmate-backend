import { Controller, Post, Param, ParseIntPipe, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ChatGateway } from 'src/chat/chat-gateway';
import { ChatService } from 'src/chat/service/chat.service';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  // Fájl(ok) feltöltése egy új üzenethez
  @Post('messages/:messageId/files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMessageFiles(
    @Param('messageId', ParseIntPipe) messageId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const message = await this.chatService.sendMessage(messageId, 0, '', files); // messageId paraméter itt csak azonosítás miatt
    this.chatGateway.server.to(`flat_${message.flatId}`).emit('receive_message', message);
    return message;
  }
}
