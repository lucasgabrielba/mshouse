import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, compareSync, hashSync } from "bcrypt";
import { MemberEntrypoint } from "entrypoint/member.entrypoint";
import { MemberApplicationService } from "../../../company/application/service/MemberApplicationService";
import { Member } from "../../../company/domain/entities/Member";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Result } from "../../../../kernel/Result/Result";

interface TokenPayload {
  memberId: string
}

@Injectable()
export class AuthService {
  protected applicationService: MemberApplicationService;

  constructor(
    entrypoint: MemberEntrypoint,
    private readonly jwtService: JwtService
  ) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async login(member: Member) {
    const token = this.jwtService.sign({
      sub: member.id,
      word: member.name
    })

    const refreshToken = this.jwtService.sign({
      sub: member.id,
      word: 'refresh'
    })

    const result = await this.setCurrentRefreshToken(refreshToken, member.id)
    if (result.isFailure()) {
      return result.error
    }

    return {
      token: token,
      refreshToken: refreshToken
    }
  }

  async validateMember(email: string, password: string): Promise<Member> {
    const member = await this.applicationService.findByEmail(email)

    if (member.isFailure()) {
      return null
    }

    const isPasswordValid = compareSync(password, member.data.password)

    if (!isPasswordValid) {
      return null
    }

    return member.data
  }

  async getMember(id: string): Promise<Member> {
    const member = await this.applicationService.getById(id)
    if (member.isFailure()) {
      return null
    }

    return member.data
  }

  async createAccessTokenFromRefreshToken
    (refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as TokenPayload
      if (!decoded) {
        throw new Error();
      }

      const member = await this.applicationService.getById(decoded.memberId);
      if (member.isFailure()) {
        throw new HttpException('Member with this id does not exist', HttpStatus.NOT_FOUND);
      }

      const isRefreshTokenMatching = await compare(refreshToken, member.data.refresh_token);
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }

      await this.jwtService.verifyAsync(refreshToken, this.getTokenOptions());
      return this.login(member.data);
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

  async setCurrentRefreshToken(refreshToken: string, memberId: string) {
    const currentHashedRefreshToken = hashSync(refreshToken, 10);

    const result = await this.applicationService.updateEntity(memberId, {
      refresh_token: currentHashedRefreshToken
    });

    if (result.isFailure()) {
      return Result.fail(result.error)
    }

    return result
  }

  async removeRefreshToken(memberId: string) {
    const result = await this.applicationService
      .updateEntity(memberId, { refresh_token: null });

    if (result.isFailure()) {
      return result.error
    }

    return result
  }

}
