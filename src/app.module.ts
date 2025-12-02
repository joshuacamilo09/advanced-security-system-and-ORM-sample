import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './security/auth/auth.module';
import { PrismaService } from 'prisma/PrismaService';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}


//nao precisamos registrar global por enquanto, usamos @UseGuards(JwtAuthGuard) nas rotas protegidas.