// auth/dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/@generated/prisma/user-role.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: 'Érvényes email címet kell megadni' })
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie' })
  password: string;

  @Field()
  @IsString()
  @MinLength(2, { message: 'A felhasználónévnek legalább 2 karakter hosszúnak kell lennie' })
  username: string;

  @Field()
  @IsEnum(() => UserRole, { message: 'Érvényes szerepkört kell megadni' })
  role: UserRole;
}
