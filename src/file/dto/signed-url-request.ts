// file-upload.dto.ts
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class SignedUrlsRequest {
    @Field(() => [String], { description: 'Fájl kulcsok listája' })
    keys: string[];
}
