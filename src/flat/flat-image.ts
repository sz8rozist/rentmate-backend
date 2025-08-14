import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class FlatImage {
  @Field(type => ID)
  id: number;

  @Field()
  url: string;

  @Field()
  path: string;

  @Field(type => Int)
  flatId: number;
}