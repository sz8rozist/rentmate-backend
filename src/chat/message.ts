import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { User } from "src/auth/user";
import { Flat } from "src/flat/flat";

@ObjectType()
export class Message {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  flatId: number;

  @Field(() => Int)
  senderId: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  imageUrls?: string;

  // Kapcsolatok (relations)
  @Field(() => Flat)
  flat: Flat;

  @Field(() => User)
  sender: User;
}
