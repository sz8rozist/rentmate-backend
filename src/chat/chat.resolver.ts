import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { CreateMessageInput } from "./dto/create.message.input";
import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { UploadAttachmentInput } from "./dto/upload.attachment.input";

@WebSocketGateway({
  cors: { origin: "*" },
})
export class ChatResolver {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  // Szobához csatlakozás
  @SubscribeMessage("joinRoom")
  async joinRoom(
    @MessageBody() data: { flatId: number },
    @ConnectedSocket() client: Socket
  ) {
    const roomName = `flat_${data.flatId}`;
    client.join(roomName);
  }

  // Üzenet küldés
  @SubscribeMessage("sendMessage")
  async handleMessage(
    @MessageBody() input: CreateMessageInput,
    @ConnectedSocket() client: Socket
  ): Promise<number> {
    // Üzenet mentése az adatbázisba
    const message = await this.chatService.createMessage(input);

    // ha NINCS attachment → azonnal broadcast
    if (!input.hasAttachment) {
      const roomName = `flat_${input.flatId}`;
      this.server.to(roomName).emit("messageAdded", message);
    }

    return message.id;
  }

  // Melléklet feltöltése után
  @SubscribeMessage("uploadAttachment")
  async handleAttachment(@MessageBody() input: UploadAttachmentInput, @ConnectedSocket() client: Socket) {
    await this.chatService.uploadMessageImage(input.file, input.messageId);
    const message = await this.chatService.getMessageById(input.messageId);
    const roomName = `flat_${message.flat.id}`;
    this.server.to(roomName).emit("messageAdded", {
      ...message,
    });
  }

  // Opció: ha szeretnél lekérni üzeneteket
  @SubscribeMessage("getMessages")
  async getMessages(
    @MessageBody() data: { flatId: number },
    @ConnectedSocket() client: Socket
  ) {
    const messages = await this.chatService.findMessages(data.flatId);
    client.emit("messages", messages);
  }
}
