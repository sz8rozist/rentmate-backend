import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { CreateMessageInput } from "./dto/create.message.input";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findMessages(flatId: number): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { flatId },
      include: { sender: true, flat: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async createMessage(input: CreateMessageInput): Promise<Message> {
  return this.prisma.message.create({
    data: {
      flatId: input.flatId,
      senderId: input.senderId,
      content: input.content,
      imageUrls: input.imageUrls ? JSON.stringify(input.imageUrls) : null,
    },
    include: { sender: true, flat: true },
  });
}
}
