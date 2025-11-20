import { MessageAttachmentDTO } from "./message.attachment.dto";

export type MessageDTO = {
  id: number;
  content: string;
  createdAt: Date;
  flat: {
    id: number;
    address: string;
    price: number;
    landlordId: number;
  };
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  messageAttachments: MessageAttachmentDTO[];
};
