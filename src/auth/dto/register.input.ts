// auth/dto/register.input.ts
import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../user-role";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: "Érvényes email címet kell megadni" })
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @MinLength(6, {
    message: "A jelszónak legalább 6 karakter hosszúnak kell lennie",
  })
  password: string;

  @Field(() => UserRole)
  @IsNotEmpty()
  role: UserRole;
}
