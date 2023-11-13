import { UsersService } from "@app/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

export type ResponseToken = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser({ email, password }): Promise<any> {
    const user = await this.usersService.find(email);
    if (user && (await compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(email: string, password: string): Promise<ResponseToken> {
    const user = await this.validateUser({ email, password });
    return this.login(user);
  }

  async refresh(user: any): Promise<ResponseToken> {
    return this.login(user);
  }
}
