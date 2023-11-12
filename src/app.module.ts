import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { AuthModule } from "@app/auth/auth.module";
import { getEnvPath } from "@app/common/helper/env.helper";
import { ModelHasRolesModule } from "@app/model_has_roles/model_has_roles.module";
import { ResourcesModule } from "@app/resources/resources.module";
import { RolesModule } from "@app/roles/roles.module";
import { UsersModule } from "@app/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Media } from "./media/entities/media.entity";
import { MediaModule } from "./media/media.module";
import { ModelHasRole } from "./model_has_roles/entities/model_has_role.entity";
import { Permission } from "./permissions/entities/permission.entity";
import { PermissionsModule } from "./permissions/permissions.module";
import { Professor } from "./professor/entities/professor.entity";
import { ProfessorModule } from "./professor/professor.module";
import { Resource } from "./resources/entities/resource.entity";
import { RoleHasPermission } from "./role_has_permissions/entities/role_has_permission.entity";
import { RoleHasPermissionsModule } from "./role_has_permissions/role_has_permissions.module";
import { Role } from "./roles/entities/role.entity";
import { S3Module } from "./s3/s3Bucket.module";
import { Subject } from "./subject/entities/subject.entity";
import { SubjectModule } from "./subject/subject.module";
import { User } from "./users/entities/user.entity";

type TypeOrmModuleOptionType = "mysql" | "mariadb" | "postgres";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(`${__dirname}/common/envs`),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_CONNECTION as TypeOrmModuleOptionType,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Role,
        Professor,
        Resource,
        Permission,
        ModelHasRole,
        RoleHasPermission,
        Subject,
        Media,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ResourcesModule,
    ModelHasRolesModule,
    RolesModule,
    PermissionsModule,
    RoleHasPermissionsModule,
    SubjectModule,
    MediaModule,
    ProfessorModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
