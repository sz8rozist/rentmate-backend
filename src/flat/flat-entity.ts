import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { FlatImage } from "./flat-image";
import { FlatStatus } from "./flat-status";
import { Message } from "src/chat/message-entity";
import { User } from "src/auth/user-entity";

@ObjectType()
export class Flat {
  @Field(type => ID)
  id: number;

  @Field()
  address: string;

  @Field(type => Int)
  price: number;

  @Field(type => FlatStatus)
  status: FlatStatus;

  @Field(type => Int)
  landlordId: number;

  @Field(type => [FlatImage], { nullable: 'itemsAndList' })
  images?: FlatImage[];

  @Field(type => [Message], { nullable: 'itemsAndList' })
  messages?: Message[];

  @Field(type => [User], { nullable: 'itemsAndList' })
  tenants?: User[];
}