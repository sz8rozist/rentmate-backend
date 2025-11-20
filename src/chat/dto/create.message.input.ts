import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  flatId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  senderId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;
}
