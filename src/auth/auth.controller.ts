import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService, ResponseToken } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(@Body() signInDto: Record<string, any>): Promise<ResponseToken> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("refresh")
  async refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }
}
