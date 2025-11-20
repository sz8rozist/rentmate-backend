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

//TODO: Meg kell oldani, hogy az üzenethez küldött képet vagy fájlt minioba tároljuk. Kell egy új db tábla például:  message_attachments (id, messageId, url, createdAt) Ahol tároljuk az üzenethez küldött fájlt.


@WebSocketGateway({
  cors: { origin: "*" }, // Flutter app origin
})
export class ChatResolver {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

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
  ) {
    // Üzenet mentése az adatbázisba
    const message = await this.chatService.createMessage(input);

    // Broadcast a szobának
    const roomName = `flat_${input.flatId}`;
    this.server.to(roomName).emit("messageAdded", message);
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
