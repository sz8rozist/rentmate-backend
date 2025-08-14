import { registerEnumType } from "@nestjs/graphql";

export enum FlatStatus {
  available = 'available',
  rented = 'rented',
}
registerEnumType(FlatStatus, { name: 'FlatStatus' });