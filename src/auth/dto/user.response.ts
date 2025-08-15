import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRole } from '../user-role';

@ObjectType()
export class PublicUser {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Int, { nullable: true })
  flatId: number | null;
}