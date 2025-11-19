// file-upload.dto.ts
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import type { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class UploadFilesInput {
  @Field(() => [GraphQLUpload], { description: 'Fájlok feltöltése' })
  files!: Promise<FileUpload>[]; // GraphQLUpload típus tömbben
}

@ObjectType()
export class FileUploadResponse {
  @Field()
  key!: string;

  @Field()
  url!: string;
}

@ObjectType()
export class UploadFilesResponse {
  @Field(() => [FileUploadResponse])
  files!: FileUploadResponse[];
}
