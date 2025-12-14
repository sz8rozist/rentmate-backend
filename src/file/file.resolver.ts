import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UploadFilesResponse, UploadFilesInput } from "./dto/file-upload-dto";
import { SignedUrlsRequest } from "./dto/signed-url-request";
import { SignedUrlResponse } from "./dto/signed-url-response";
import type { FileStorageService } from "./file-storage-interface";
import { HttpStatus, Inject } from "@nestjs/common";
import { AppException } from "src/common/exception/app.exception";

@Resolver()
export class FileResolver {
  constructor(@Inject("FileStorageService") private fileService: FileStorageService) {}

  @Mutation(() => UploadFilesResponse)
  async uploadFiles(
    @Args("input") input: UploadFilesInput
  ): Promise<UploadFilesResponse> {
    if (!input?.files?.length) {
      throw new AppException("No files provided", HttpStatus.BAD_REQUEST);
    }

    const files = await Promise.all(
      input.files.map(async (filePromise) => {
        const file = await filePromise;
        if (!file) {
          throw new AppException("Fájl üres", HttpStatus.BAD_REQUEST);
        }
        return this.fileService.uploadFile(file);
      })
    );

    return { files };
  }

  @Query(() => SignedUrlResponse)
  async getSignedUrlsToFile(
    @Args("input") input: SignedUrlsRequest
  ): Promise<SignedUrlResponse> {
    if (!input?.keys?.length) {
      throw new AppException("No keys provided", HttpStatus.BAD_REQUEST);
    }

    return await this.fileService.getSignedUrls(input);
  }
}
