import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SignedUrlResponse {
  @Field(() => [String])
  urls!: string[];

   constructor(urls?: string[]) {
    if (urls) {
      this.urls = urls;
    } else {
      this.urls = [];
    }
  }
}