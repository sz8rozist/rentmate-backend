import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { User } from "src/user/user";
import { FlatImage } from "./flat-image";
import { FlatStatus } from "./flat-status";
import { Message } from "src/chat/message";

@ObjectType()
export class Flat {
  @Field(() => ID)
  id: number;

  @Field()
  address: string;

  @Field(() => Int)
  price: number;

  @Field(() => FlatStatus)
  status: FlatStatus;

  @Field(() => Int)
  landlordId: number;

  // Kapcsolatok (relations)
  @Field(() => User)
  landlord: User;

  @Field(() => [FlatImage], { nullable: true })
  images?: FlatImage[];

  @Field(() => [Message])
  messages: Message[];

  @Field(() => [User])
  tenants: User[];
}
