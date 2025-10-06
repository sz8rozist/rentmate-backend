import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DocumentsService } from "./documents.service";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
import { DocumentModel } from "./document.model";
import { CreateDocumentInput } from "./dto/create.document";

@Resolver()
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => DocumentModel)
  async uploadDocument(
    @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
    @Args("data") data: CreateDocumentInput
  ): Promise<DocumentModel> {
    return this.documentsService.uploadDocument(
      file,
      data.category,
      data.flatId
    );
  }

  @Query(() => [DocumentModel])
  async documents(@Args("flatId") flatId: string) {
    return this.documentsService.getDocuments(flatId);
  }

  @Mutation(() => Boolean)
  async deleteDocument(@Args("id") id: string) {
    return this.documentsService.deleteDocument(id);
  }
}
