import { InputType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  flatId: number;

  @Field(() => Int)
  senderId: number;

  @Field()
  content: string;

  @Field(() => GraphQLJSON, { nullable: true })
  imageUrls?: any;
}
