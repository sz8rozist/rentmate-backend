import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
  landlord = 'landlord',
  tenant = 'tenant',
}
registerEnumType(UserRole, {
  name: 'UserRole',
});