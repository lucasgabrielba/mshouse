import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, compareSync, hashSync } from "bcrypt";
import { UserEntrypoint } from "entrypoint/user.entrypoint";
import { UserApplicationService } from "../../../company/application/service/UserApplicationService";
import { User } from "../../../company/domain/entities/User";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Result } from "../../../../kernel/Result/Result";

interface TokenPayload {
  userId: string
}

@Injectable()
export class AuthService {
  protected applicationService: UserApplicationService;

  constructor(
    entrypoint: UserEntrypoint,
    private readonly jwtService: JwtService
  ) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async login(user: User) {
    const token = this.jwtService.sign({
      sub: user.id,
      word: user.name
    })

    const refreshToken = this.jwtService.sign({
      sub: user.id,
      word: 'refresh'
    })

    const result = await this.setCurrentRefreshToken(refreshToken, user.id)
    if (result.isFailure()) {
      return result.error
    }

    return {
      token: token,
      refreshToken: refreshToken
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.applicationService.findByEmail(email)

    if (user.isFailure()) {
      return null
    }

    const isPasswordValid = compareSync(password, user.data.password)

    if (!isPasswordValid) {
      return null
    }

    return user.data
  }

  async createAccessTokenFromRefreshToken
    (refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as TokenPayload
      if (!decoded) {
        throw new Error();
      }

      const user = await this.applicationService.getById(decoded.userId);
      if (user.isFailure()) {
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
      }

      const isRefreshTokenMatching = await compare(refreshToken, user.data.refresh_token);
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }

      await this.jwtService.verifyAsync(refreshToken, this.getTokenOptions());
      return this.login(user.data);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getTokenOptions() {
    const options: JwtSignOptions = {
      secret: process.env.REFRESHTOKENSECRET,
    };
    const expiration: string = process.env.REFRESHTOKENEXPIRATION;
    if (expiration) {
      options.expiresIn = expiration;
    }
    return options;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = hashSync(refreshToken, 10);

    const result = await this.applicationService.updateEntity(userId, {
      refresh_token: currentHashedRefreshToken
    });

    if (result.isFailure()) {
      return Result.fail(result.error)
    }

    return result
  }

  async removeRefreshToken(userId: string) {
    const result = await this.applicationService
      .updateEntity(userId, { refresh_token: null });

    if (result.isFailure()) {
      return result.error
    }

    return result
  }

}
