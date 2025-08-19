import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ChatService } from './chat.service';
import { CreateMessageInput } from './dto/create.message.input';
import { Message } from './message';

@Resolver(() => Message)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  @Query(() => [Message])
  async messages(@Args('flatId', { type: () => Int }) flatId: number) {
    return this.chatService.findMessages(flatId);
  }

  @Mutation(() => Message)
  async createMessage(@Args('input') input: CreateMessageInput) {
    const message = await this.chatService.createMessage(input);

    // küldjük ki a subscriptionnek
    this.pubSub.publish('messageAdded', { messageAdded: message });

    return message;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => {
      // csak annak a flat-nek az üzenetei menjenek, amit kér a kliens
      return payload.messageAdded.flatId === variables.flatId;
    },
  })
  messageAdded(@Args('flatId', { type: () => Int }) flatId: number) {
    return this.pubSub.asyncIterableIterator('messageAdded');
  }
}
