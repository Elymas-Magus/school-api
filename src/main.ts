import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { SwaggerDocumentationAdapter } from "./documentation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = SwaggerDocumentationAdapter.create();
  const document = SwaggerModule.createDocument(app, config.getConfig());

  SwaggerModule.setup("api", app, document);
  await app.listen(process.env.APP_PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
