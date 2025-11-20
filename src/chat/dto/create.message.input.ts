import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
