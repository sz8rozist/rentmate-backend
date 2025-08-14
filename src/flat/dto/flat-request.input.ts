import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";
import { FlatStatus } from "src/@generated/prisma/flat-status.enum";

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

  @Field(() => FlatStatus, { nullable: false })
  @IsNotEmpty()
  status: FlatStatus;

  @Field(() => Int)
  @IsInt()
  landlordId: number;
}
