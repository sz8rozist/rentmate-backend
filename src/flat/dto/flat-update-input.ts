import { InputType, Field, Int } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  isString,
  IsEnum,
} from "class-validator";
import { FlatStatus } from "../flat-status";

@InputType()
export class FlatUpdateInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  price: number;

  @Field(() => FlatStatus)
  @IsEnum(FlatStatus)
  status: FlatStatus;
}
