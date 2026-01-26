import { Module } from "@nestjs/common";
import { ChatService } from "./service/chat.service";
import { FileModule } from "src/file/file.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { ChatControllerController } from './controller/chat-controller/chat-controller.controller';
@Module({
  providers: [ChatService],
  imports: [PrismaModule, FileModule],
  controllers: [ChatControllerController],
})
export class ChatModule {}
