import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileService } from './file.service';
import { UploadFilesResponse, UploadFilesInput } from './dto/file-upload-dto';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Mutation(() => UploadFilesResponse)
  async uploadFiles(
    @Args('input') input: UploadFilesInput,
  ): Promise<UploadFilesResponse> {
    const files = await Promise.all(
      input.files.map(async (filePromise) => {
        const file = await filePromise;
        return this.fileService.uploadFile(file);
      }),
    );

    return { files };
  }
}
