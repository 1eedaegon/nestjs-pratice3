import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger3 } from './middleware/logger3.middleware';
import { AuthGuard } from './guard/authorization.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(new AuthGuard());
  app.use(logger3);
  await app.listen(3000);
}
bootstrap();
