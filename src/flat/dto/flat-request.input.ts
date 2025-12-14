import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

@InputType()
export class FlatRequestInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  price: number;

  @Field(() => Int)
  @IsInt()
  landlordId: number;
}
