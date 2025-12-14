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
import { FileHelper } from "src/file/file-helper";
import { Inject } from "@nestjs/common";
import type { FileStorageService } from "src/file/file-storage-interface";
import { Args, Int, Mutation } from "@nestjs/graphql";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
@WebSocketGateway({
  cors: { origin: "*" },
})
export class ChatResolver {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    @Inject("FileStorageService")
    private readonly fileService: FileStorageService
  ) {}

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

  /*@SubscribeMessage("uploadAttachment")
  async handleAttachment(
    @MessageBody() input: UploadAttachmentInput,
    @ConnectedSocket() client: Socket
  ) {
    await this.chatService.uploadMessageImage(input, input.messageId);
    var message = await this.chatService.getMessageById(input.messageId);
    const messageWithAttachments = await FileHelper.attachSignedAttachmentUrls(
      message,
      this.fileService
    );
    const roomName = `flat_${messageWithAttachments.flat.id}`;
    this.server.to(roomName).emit("messageAdded", {
      ...messageWithAttachments,
    });
  }*/

  @Mutation(() => Boolean)
  async uploadAttachment(
    @Args("messageId", { type: () => Int }) messageId: number,
    @Args("file", { type: () => GraphQLUpload }) file: FileUpload
  ): Promise<boolean> {
    await this.chatService.uploadMessageImage(file, messageId);
    const message = await this.chatService.getMessageById(messageId);
    const messageWithAttachments = await FileHelper.attachSignedAttachmentUrls(
      message,
      this.fileService
    );
    const roomName = `flat_${messageWithAttachments.flatId}`;
    this.server.to(roomName).emit("messageAdded", {
      ...messageWithAttachments,
    });
    return true;
  }

  @SubscribeMessage("getMessages")
  async getMessages(
    @MessageBody() data: { flatId: number },
    @ConnectedSocket() client: Socket
  ) {
    const messages = await this.chatService.findMessages(data.flatId);
    const messageWithAttachments =
      await FileHelper.attachSignedAttachmentUrlsToMany(
        messages,
        this.fileService
      );
    client.emit("messages", messageWithAttachments);
  }
}
