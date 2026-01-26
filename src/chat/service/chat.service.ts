import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { BusinessValidationException } from "src/common/exception/business.validation.exception";
import { FileService } from "src/file/file.service";

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async sendMessage(
    flatId: number,
    senderId: number,
    content?: string,
    files?: Express.Multer.File[],
  ) {
    const message = await this.prisma.message.create({
      data: {
        flatId,
        senderId,
        content: content || "",
      },
    });

    if (files?.length) {
      for (const file of files) {
        await this.fileService.uploadFile(file);
        await this.prisma.messageAttachment.create({
          data: {
            filename: file.originalname,
            messageId: message.id,
          },
        });
      }
    }

    const messageWithFiles = await this.prisma.message.findUnique({
      where: { id: message.id },
      include: { messageAttachments: true },
    });
    if (!messageWithFiles) {
      throw new BusinessValidationException({ message: "Üzenet létrehozása sikertelen" });
    }
    return {
      ...messageWithFiles,
      messageAttachments: messageWithFiles.messageAttachments.map((f) => ({
        ...f,
        url: this.fileService.getPublicUrl(f.filename),
      })),
    };
  }

  async getMessagesForFlat(flatId: number) {
    const messages = await this.prisma.message.findMany({
      where: { flatId },
      include: { messageAttachments: true, sender: true },
      orderBy: { createdAt: "asc" },
    });

    return messages.map((m) => ({
      ...m,
      messageAttachments: m.messageAttachments.map((f) => ({
        ...f,
        url: this.fileService.getPublicUrl(f.filename),
      })),
    }));
  }
}
