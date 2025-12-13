import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateMessageInput } from "./dto/create.message.input";
import { BaseService } from "src/common/base.service";
import { FileService } from "src/file/file.service";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import { MessageDTO } from "./dto/message.dto";

@Injectable()
export class ChatService extends BaseService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService
  ) {
    super(ChatService.name);
  }

  async findMessages(flatId: number): Promise<MessageDTO[]> {
    return await this.prisma.message.findMany({
      where: { flatId },
      include: {
        sender: true,
        flat: true,
        messageAttachments: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }

  async createMessage(input: CreateMessageInput): Promise<MessageDTO> {
    const message = await this.prisma.message.create({
      data: {
        flatId: input.flatId,
        senderId: input.senderId,
        content: input.content,
      },
      include: { sender: true, flat: true },
    });

    //Attachment nélkül adjuk vissza egyelőre
    return { ...message, messageAttachments: [] };
  }

  async uploadMessageImage(
    image: FileUpload,
    messageId: number
  ): Promise<string> {
    this.logger.log(`Kép feltöltés üzenethez: ${messageId}`);
    const { key, url } = await this.fileService.uploadFile(image);

    await this.prisma.messageAttachment.create({
      data: {
        messageId: messageId,
        url: url,
      },
    });

    return url;
  }

  async getMessageById(id: number): Promise<MessageDTO> {
    return await this.prisma.message.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        flat: {
          select: {
            id: true,
            address: true,
            price: true,
            landlordId: true,
          },
        },
        messageAttachments: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }
}
