import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateMessageInput } from "./dto/create.message.input";
import { Message } from "./message";

type MessageSummary = Omit<Message, "sender" | "flat"> & {
  sender: { id: number; name: string; email: string;};
  flat: { id: number; address: string; price: number; landlordId: number;};
};

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findMessages(flatId: number): Promise<MessageSummary[]> {
    return this.prisma.message.findMany({
      where: { flatId },
      include: { sender: true, flat: true},
      orderBy: { createdAt: "asc" },
    });

  }

  async createMessage(input: CreateMessageInput): Promise<MessageSummary> {
  return this.prisma.message.create({
    data: {
      flatId: input.flatId,
      senderId: input.senderId,
      content: input.content
    },
    include: { sender: true, flat: true },
  });
}
}
