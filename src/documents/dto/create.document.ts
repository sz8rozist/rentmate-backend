import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDocumentInput {
  @Field()
  originalName: string;

  @Field()
  category: string;

  @Field()
  flatId: number;
}
