import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { ChatGateway } from "src/chat/chat-gateway";
import { MessageDto } from "src/chat/dto/message-dto";
import { ChatService } from "src/chat/service/chat.service";

@ApiTags("Chat")
@Controller("chat")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  // Fájl(ok) feltöltése egy új üzenethez
  @Post("messages/:messageId/files")
  @UseInterceptors(FilesInterceptor("files"))
  @ApiOperation({ summary: "Fájl(ok) feltöltése egy meglévő üzenethez" })
  @ApiParam({
    name: "messageId",
    type: Number,
    description: "Üzenet azonosító",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Feltöltendő fájl(ok)",
    required: true,
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "A létrejött üzenet a csatolt fájlokkal",
    type: MessageDto,
  })
  async uploadMessageFiles(
    @Param("messageId", ParseIntPipe) messageId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const message = await this.chatService.sendMessage(messageId, 0, "", files); // messageId paraméter itt csak azonosítás miatt
    this.chatGateway.server
      .to(`flat_${message.flatId}`)
      .emit("receive_message", message);
    return message;
  }
}
