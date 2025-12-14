import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Flat } from "./flat";

@ObjectType()
export class FlatImage {
  @Field(() => ID)
  id: number;

  @Field()
  filename: string;

  @Field(() => Int)
  flatId: number;

  // Kapcsolat (relation)
  @Field(() => Flat)
  flat: Flat;


  @Field({ nullable: true })
  url?: string; 
}