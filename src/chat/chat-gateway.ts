import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./service/chat.service";

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const flatId = client.handshake.query.flatId;
    client.join(`flat_${flatId}`);
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @MessageBody()
    payload: {
      flatId: number;
      senderId: number;
      content?: string;
    },
  ) {
    const message = await this.chatService.sendMessage(
      payload.flatId,
      payload.senderId,
      payload.content,
    );

    this.server.to(`flat_${payload.flatId}`).emit("receive_message", message);
  }
}
