import { MessageAttachmentDTO } from "./message.attachment.dto";

export type MessageDTO = {
  id: number;
  content: string;
  createdAt: Date;
  flatId: number;
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  messageAttachments: MessageAttachmentDTO[];
};
