import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import type { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    return this.fileService.uploadFile(file);
  }
}
