import { Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConfigProxy, MiddlewareConsumer } from '@nestjs/common/interfaces';
import { AuthMiddleware } from '../middleware/middleware';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'prisma/PrismaService';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';


@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, PrismaService, JwtStrategy],
  imports: [
    UserModule, 
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3m' }
    })
  ],
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuthController)
  }
}
