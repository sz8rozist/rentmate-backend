import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/auth/user';
import { Flat } from 'src/flat/flat';
import { GraphQLJSON } from 'graphql-type-json';
@ObjectType()
export class Message {
  @Field(() => ID)
  id: number;

  @Field()
  flatId: number;

  @Field()
  senderId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  // JSON mező (image URL array)
  @Field(() => GraphQLJSON, { nullable: true })
  imageUrls?: any;

  // Relációk
  @Field(() => Flat)
  flat: Flat;

  @Field(() => User)
  sender: User;
}
