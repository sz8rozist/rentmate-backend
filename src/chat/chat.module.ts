import { Module } from "@nestjs/common";
import { ChatService } from "./service/chat.service";
import { FileModule } from "src/file/file.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { ChatController } from "./controller/chat-controller/chat-controller.controller";
import { ChatGateway } from "./chat-gateway";
import { AuthModule } from "src/auth/auth.module";
@Module({
  providers: [ChatService, ChatGateway],
  imports: [PrismaModule, FileModule, AuthModule],
  controllers: [ChatController],
})
export class ChatModule {}
