import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { FileUploadResponse } from "./dto/file-upload-dto";
import { SignedUrlsRequest } from "./dto/signed-url-request";
import { SignedUrlResponse } from "./dto/signed-url-response";

export interface FileStorageService {
  /**
   * Fájl feltöltése
   */
  uploadFile(file: FileUpload): Promise<FileUploadResponse>;

  /**
   * Fájl törlése
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Fájl létezésének ellenőrzése
   */
  fileExists(key: string): Promise<boolean>;

  /**
   * Signed URL-ek generálása letöltéshez
   */
  getSignedUrls(
    request: SignedUrlsRequest,
    expiresIn?: number
  ): Promise<SignedUrlResponse>;
}
