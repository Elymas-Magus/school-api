import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "@app/auth/auth.service";
import { AuthController } from "@app/auth/auth.controller";
import { UsersModule } from "@app/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@app/auth/jwt.strategy";
import { jwtConstants } from "@app/auth/constants";
import { JwtAuthGuard } from "./jwt-auth.guard";
// import { ModelHasRolesModule } from '@app/model_has_roles/model_has_roles.module';
// import { UsersService } from '@app/users/users.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '@app/users/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // ModelHasRolesModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1800s" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
