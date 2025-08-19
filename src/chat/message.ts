import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/auth/user';
import { Flat } from 'src/flat/flat';

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

  @Field(() => [String], { nullable: true })
  imageUrls?: string[];

  // Relációk
  @Field(() => Flat)
  flat: Flat;

  @Field(() => User)
  sender: User;
}
