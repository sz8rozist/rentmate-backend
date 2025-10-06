import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { ChatService } from "./chat.service";
import { CreateMessageInput } from "./dto/create.message.input";
import { Message } from "./message";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import { FileService } from "src/file/file.service";

@Resolver(() => Message)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly uploadService: FileService,
    @Inject("PUB_SUB") private pubSub: PubSub
  ) {}

  @Query(() => [Message])
  async messages(@Args('flatId', { type: () => Int }) flatId: number) {
    return this.chatService.findMessages(flatId);
  }

  @Mutation(() => Message)
  async createMessageWithFiles(
    @Args('input') input: CreateMessageInput,
    @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
    files?: FileUpload[],
  ) {
    const imageUrls: string[] = [];

    if (files) {
      for (const file of files) {
        const {key, url} = await this.uploadService.uploadFile(file);
        imageUrls.push(url);
      }
    }

    const message = await this.chatService.createMessage({
      ...input,
      imageUrls,
    });

    this.pubSub.publish('messageAdded', { messageAdded: message });
    return message;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) =>
      payload.messageAdded.flatId === variables.flatId,
  })
  messageAdded(@Args('flatId', { type: () => Int }) flatId: number) {
    return this.pubSub.asyncIterableIterator('messageAdded');
  }
}
