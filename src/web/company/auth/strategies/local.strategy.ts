import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";
import { AuthService } from "auth/auth.service";
import { Strategy } from "passport-local/lib/index";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "../../../../company/domain/entities/User";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      usernameField: 'email',
    })
  }

  async validate(email: string, password: string): Promise<User> {
    console.log(email)
    const result = await this.authService
      .validateUser(email, password);

    if (!result) {
      throw new UnauthorizedException('email ou senha invalidos')
    }

    return result;
  }
}
