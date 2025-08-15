import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { AppException } from 'src/common/exception/app.exception';
import { PublicUser } from './dto/user.response';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new AppException('Invalid credentials', 401, 'AUTH_ERROR');
    const token = await this.authService.login(user);
    return token.access_token;
  }

  @Mutation(() => PublicUser)
  @UsePipes(new ValidationPipe())
  async register(@Args('data') data: RegisterInput): Promise<PublicUser> {
    const user = await this.authService.findUserByEmail(data.email);
    if (user) throw new AppException('Ez az email cím már foglalt!', 400, 'USER_EXISTS');
    return await this.authService.register(data);
  }
}
