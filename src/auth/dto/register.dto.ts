import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  // opcionális: role default 'TENANT'
  role?: 'tenant' | 'landlord';
}