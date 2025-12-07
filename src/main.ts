import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { helmetConfig } from './security/auth/configCommon/helmet.config';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {

  //LOGGER 
  //estamos usando Loggers winstons para captura de erros de forma profissional, criamos o logger global
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`,
            ),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    //isso ja da:
    /* 
      - logs no console 
      - logs de erro em error.log
      - logs gerais em combined.log
    */
  });

  //HELMET 
  app.use(helmetConfig());

  await app.listen(process.env.PORT ?? 3000);
  //app.useGlobalInterceptors(new LoggingInterceptor()); //interceptor global (pega o projeto inteiro, esse é o mais usado em projetos reais)
  //app.useGlobalInterceptors(new ErrorCatcherInterceptor());
  //app.useGlobalInterceptors(new TimeoutInterceptor());
  //app.useGlobalInterceptors(new LoggingInterceptor()); //da pra usar o interceptor globalmente
  
  //CORS
  app.enableCors({ 
  origin: [
    //'https://meu-frontend.com',
    'http://localhost:3000',
  ],
    credentials: true, // necessário para cookies, sessões e CSRF
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  //CSRF
  app.use(cookieParser());
  const config = app.get(ConfigService);
  const csrfSecret = config.get('CSRF_SECRET');
  const {doubleCsrfProtection} = doubleCsrf({
    getSecret: () => csrfSecret,
    getSessionIdentifier: (req) => req.cookies['refresh_token'], //ou outra logica para gerar id sessions
    cookieOptions: {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    }
  });
  app.use(doubleCsrfProtection);

  
  //Rate Limiting (registar no app.module.ts)
}
bootstrap();
