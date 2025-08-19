import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { PubSubModule } from 'src/pubsub/pubsub.module';

@Module({
  providers: [ChatResolver, ChatService],
  imports: [PubSubModule]
})
export class ChatModule {}
