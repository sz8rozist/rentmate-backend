import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { AppException } from 'src/common/exception/app.exception';

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

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput): Promise<string> {
    return await this.authService.register(input);
  }
}
