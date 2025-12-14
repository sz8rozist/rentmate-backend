import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateMessageInput } from "./dto/create.message.input";
import { BaseService } from "src/common/base.service";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import { MessageDTO } from "./dto/message.dto";
import type { FileStorageService } from "src/file/file-storage-interface";

@Injectable()
export class ChatService extends BaseService {
  constructor(
    private prisma: PrismaService,
    @Inject("FileStorageService") private fileService: FileStorageService
  ) {
    super(ChatService.name);
  }

  async findMessages(flatId: number): Promise<MessageDTO[]> {
    this.logger.log(`Üzenetek lekérése flatId=${flatId}`);
    return await this.prisma.message.findMany({
      where: { flatId },
      include: {
        sender: true,
        flat: true,
        messageAttachments: {
          select: {
            id: true,
            filename: true,
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
    this.logger.log(`Kép feltöltés üzenethez: ${messageId}, ${image.filename}`);
    const { key, url } = await this.fileService.uploadFile(image);

  this.logger.log(`Fájl feltöltve key=${key}`);

  await this.prisma.messageAttachment.create({
    data: {
      messageId: messageId,
      filename: key,
    },
  });

    return key;
  }

  async getMessageById(id: number): Promise<MessageDTO> {
    return await this.prisma.message.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        flatId: true,
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messageAttachments: {
          select: {
            id: true,
            filename: true,
          },
        },
      },
    });
  }
}
