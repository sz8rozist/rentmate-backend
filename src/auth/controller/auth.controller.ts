import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { AuthService } from "../service/auth.service";
import { Public } from "../../common/decorator/public.decorator";
import { RegisterDto } from "../dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
}
