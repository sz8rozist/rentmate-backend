import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  type: string;

  @Field()
  category: string;

  @Field()
  filePath: string;

  @Field()
  flatId: number;

  @Field()
  uploadedAt: Date;
}
