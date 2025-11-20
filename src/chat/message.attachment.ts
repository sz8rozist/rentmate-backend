import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Message } from "./message";

@ObjectType()
export class MessageAttachment {
  @Field(() => ID)
  id: number;

  @Field()
  url: number;

  @Field()
  messageId: number;

  @Field(() => Message)
  messages: Message;
}
