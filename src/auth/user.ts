import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { UserRole } from "./user-role";
import { Message } from "src/chat/message";
import { Flat } from "src/flat/flat";

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Int, { nullable: true })
  flatId?: number;

  @Field()
  password: string;

  // Kapcsolatok (relations)
  @Field(() => [Flat])
  ownedFlats: Flat[];

  @Field(() => [Message])
  messages: Message[];

  @Field(() => Flat, { nullable: true })
  flat?: Flat;
}
