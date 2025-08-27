import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Flat } from "./flat";

@ObjectType()
export class FlatImage {
  @Field(type => ID)
  id: number;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field(type => Int)
  flatId: number;

  // Kapcsolat (relation)
  @Field(() => Flat)
  flat: Flat;
}