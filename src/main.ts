import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validationPipeConfig } from './config/validation-pipe.config';
import { ENV_DEV, ENV_LOCAL, ENV_STAGE } from './constants/system';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  Logger.overrideLogger(new Logger('API'));

  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const currentEnv = configService.get<string>('NODE_ENV')!;
  const port = configService.get<number>('PORT');
  const corsOrigins = configService.get<string>('SITE_ORIGIN');
  const corsOriginsArray = corsOrigins?.split(',').filter(Boolean) ?? [];

  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  app.enableShutdownHooks();
  app.enableCors({ origin: corsOriginsArray });

  // Load swagger, load only for local, staging and dev environments
  if ([ENV_LOCAL, ENV_STAGE, ENV_DEV].includes(currentEnv)) {
    const apiVersion = process.env.npm_package_version;
    const swaggerConfig = new DocumentBuilder()
      .setTitle('KSG demo API')
      .setDescription(
        `Api description for environment '${currentEnv}' version ${apiVersion}`,
      )
      .setVersion(apiVersion || 'undefined version')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port ?? 3000);

  Logger.verbose(`Listening on port ${port}`);
}
void bootstrap();
