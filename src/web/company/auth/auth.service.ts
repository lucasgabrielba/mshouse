import { Injectable } from "@nestjs/common";
import { compareSync } from "bcrypt";
import { UserEntrypoint } from "entrypoint/user.entrypoint";
import { UserApplicationService } from "../../../company/application/service/UserApplicationService";
import { User } from "../../../company/domain/entities/User";
import { JwtService } from "@nestjs/jwt";

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
    const payload = {
      sub: user.id,
      email: user.email,
    }

    return {
      token: this.jwtService.sign(payload)
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


}