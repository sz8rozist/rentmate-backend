import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Message } from "src/chat/message-entity";
import { Flat } from "src/flat/flat-entity";
import { UserRole } from "./user-role";

@ObjectType()
export class User {
  @Field(type => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(type => UserRole)
  role: UserRole;

  @Field(type => Int, { nullable: true })
  flatId?: number;

  @Field()
  password: string;

  @Field(type => [Flat], { nullable: 'itemsAndList' })
  ownedFlats?: Flat[];

  @Field(type => [Message], { nullable: 'itemsAndList' })
  messages?: Message[];

  @Field(type => Flat, { nullable: true })
  flat?: Flat;
}