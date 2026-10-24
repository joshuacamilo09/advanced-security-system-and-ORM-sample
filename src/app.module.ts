import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './security/auth/auth.module';
import { PrismaService } from 'prisma/PrismaService';
import { EncryptionModule } from './security/auth/encryption/encryption.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './security/middleware/loggerMiddleware';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, EncryptionModule,

    //pra usar env no projeto todo
    ConfigModule.forRoot({
      isGlobal: true
    }),
    //Rate Limiting
    ThrottlerModule.forRoot({
      throttlers: [ //100 req/minuto por IP
        {
          ttl: 60000, //time to live
          limit: 100,
        }
      ]
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService,
    {
      //Rate Limiting, passar sempre aqui no provider
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule implements NestModule {
  //cada requisicao vai passar pelo log automaticamente
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); 
  }
}


//nao precisamos registrar global por enquanto, usamos @UseGuards(JwtAuthGuard) nas rotas protegidas.