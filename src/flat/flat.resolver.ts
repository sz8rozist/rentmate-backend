import { Args, Int, Mutation, Resolver, Query } from "@nestjs/graphql";
import { FlatService } from "./flat.service";
import { FlatRequestInput } from "./dto/flat-request.input";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import GraphQLUpload, * as GraphQLUpload_1 from "graphql-upload/GraphQLUpload.mjs";
import { Flat } from "./flat";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
@Resolver()
export class FlatResolver {
  constructor(private flatService: FlatService) {}

  @Mutation(() => Flat)
  @UsePipes(new ValidationPipe())
  async addFlat(
    @Args("data") data: FlatRequestInput
  ) {
    return this.flatService.addFlat(data);
  }

 @Mutation(() => Boolean)
  async uploadFlatImages(
    @Args('flatId', { type: () => Int }) flatId: number,
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[],
  ): Promise<boolean> {
    // Párhuzamos feltöltés
    await Promise.all(images.map(image => this.flatService.uploadFlatImage(flatId, image)));
    return true;
  }

  @Mutation(() => Boolean)
  async deleteFlatImage(
    @Args("imageId", { type: () => Int }) imageId: number
  ): Promise<boolean> {
    await this.flatService.deleteFlatImage(imageId);
    return true;
  }

  @Mutation(() => Flat)
  async updateFlat(
    @Args("flatId", { type: () => Int }) flatId: number,
    @Args("data") data: FlatRequestInput
  ) {
    return this.flatService.updateFlat(flatId, data);
  }

  @Mutation(() => Boolean)
  async deleteFlat(
    @Args("flatId", { type: () => Int }) flatId: number
  ): Promise<boolean> {
    const result = await this.flatService.deleteFlat(flatId);
    return result.success;
  }

  @Mutation(() => Boolean)
  async addTenantToFlat(
    @Args("flatId", { type: () => Int }) flatId: number,
    @Args("tenantId", { type: () => Int }) tenantId: number
  ): Promise<boolean> {
    await this.flatService.addTenantToFlat(flatId, tenantId);
    return true;
  }

   @Query(() => Flat, { nullable: true, description: "Get a flat by its ID" })
  async flatById(@Args('id', { type: () => Int }) id: number) {
    return this.flatService.getFlatById(id);
  }

  @Mutation(() => Boolean)
  async removeTenantFromFlat(
    @Args("tenantId", { type: () => Int }) tenantId: number
  ): Promise<boolean> {
    await this.flatService.removeTenantFromFlat(tenantId);
    return true;
  }

  @Query(() => Flat, { nullable: true })
  async getFlatForTenant(
    @Args("tenantId", { type: () => Int }) tenantId: number
  ) {
    return this.flatService.getFlatForTenant(tenantId);
  }

  @Query(() => [Flat])
  async getFlatsForLandlord(
    @Args("landlordId", { type: () => Int }) landlordId: number
  ) {
    return this.flatService.getFlatsForLandlord(landlordId);
  }
}
