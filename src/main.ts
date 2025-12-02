import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  //app.useGlobalInterceptors(new LoggingInterceptor()); //interceptor global (pega o projeto inteiro, esse é o mais usado em projetos reais)
  //app.useGlobalInterceptors(new ErrorCatcherInterceptor());
  //app.useGlobalInterceptors(new TimeoutInterceptor());
  //app.useGlobalInterceptors(new LoggingInterceptor()); //da pra usar o interceptor globalmente
}
bootstrap();
