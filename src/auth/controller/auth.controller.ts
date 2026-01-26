import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../service/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginResponse } from "../dto/login.response";
import { RegisterResponse } from "../dto/register.response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Felhasználó bejelentkezés" })
  @ApiResponse({
    status: 200,
    description: "Sikeres bejelentkezés esetén a visszakapott JWT token.",
    type: [LoginResponse],
  })
  @ApiBody({
    type: LoginDto,
    description: "Bejelentkezési adatok",
    required: true,
  })
  async login(@Body() request: LoginDto) {
    return this.auth.login(request.email, request.password);
  }

  @Post("register")
  @ApiOperation({ summary: "Felhasználó regisztrációja" })
  @ApiResponse({
    status: 200,
    description: "Sikeres regisztráció esetén a visszakapott felhasználói adatok.",
    type: [RegisterResponse],
  })
  @ApiBody({
    type: RegisterDto,
    description: "Regisztrációs adatok",
    required: true,
  })
  async register(@Body() request: RegisterDto) {
    return this.auth.register(request);
  }
}
