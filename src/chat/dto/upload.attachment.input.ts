import { InputType, Field, Int } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';

@InputType()
export class UploadAttachmentInput {
  @Field(() => Int)
  messageId: number;

  @Field(() => GraphQLUpload)
  file: FileUpload; 
}