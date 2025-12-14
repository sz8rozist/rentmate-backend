import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { FileModule } from 'src/file/file.module';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  providers: [ChatResolver, ChatService],
  imports: [PrismaModule,FileModule]
})
export class ChatModule {}
