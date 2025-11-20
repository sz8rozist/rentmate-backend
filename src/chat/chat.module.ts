import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [ChatResolver, ChatService],
  imports: [FileModule]
})
export class ChatModule {}
