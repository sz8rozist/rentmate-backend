import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class Message {
  @Field(type => ID)
  id: number;

  @Field(type => Int)
  flatId: number;

  @Field(type => Int)
  senderId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  imageUrls?: string;
}