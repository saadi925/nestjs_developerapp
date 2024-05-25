import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter());
  app.enableCors();
  app.setGlobalPrefix('v1/api')
  app.register(fastifyCookie, {
    secret : process.env.COOKIE_SECRET
  })
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
