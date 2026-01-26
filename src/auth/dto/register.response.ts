import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class RegisterResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: UserRole;
}
