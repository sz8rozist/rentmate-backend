import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  flatId: number;

  @Field(() => Int)
  senderId: number;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  imageUrls?: string[];
}
