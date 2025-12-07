import { Controller, Post, Body, Res, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './authDTO/login.dto';
import express from 'express';
import { RegisterDto } from './authDTO/register.dto';
import { JwtAuthGuard } from './Guards/JwtAuthGuard';
import { Throttle } from '@nestjs/throttler';


@Throttle({ default: { limit: 10, ttl: 60000}}) //5 tentativas por minuto.
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: express.Response) {
    const { user, tokens } = await this.authService.register(dto);

    // set refresh token in httpOnly cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    });

    return { user, access_token: tokens.access_token };
  }

  @Post('login')
  async login(@Body() dto: LoginDTO, @Res({ passthrough: true }) res: express.Response) {
    const { user, tokens } = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/auth/refresh',
      maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    });

    return { user, access_token: tokens.access_token };
  }

  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const rt = req.cookies?.refresh_token;
    if (!rt) return { message: 'No refresh token' };

    // decode RT to get user id (we signed { sub: userId })
    try {
      const payload = await this.authService['jwtService'].verifyAsync(rt, { secret: process.env.JWT_REFRESH_SECRET });
      const userId = payload.sub;
      const tokens = await this.authService.refreshToken(userId, rt);

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/auth/refresh',
        maxAge: this.msFromEnv(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
      });

      return { access_token: tokens.access_token };
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    const user = (req as any).user;
    await this.authService.logout(user.sub);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: express.Request) {
    return (req as any).user;
  }

  private msFromEnv(exp: string) {
    // basic parser: supports '15m' and '7d'
    if (exp.endsWith('m')) return parseInt(exp.slice(0, -1)) * 60 * 1000;
    if (exp.endsWith('h')) return parseInt(exp.slice(0, -1)) * 60 * 60 * 1000;
    if (exp.endsWith('d')) return parseInt(exp.slice(0, -1)) * 24 * 60 * 60 * 1000;
    return 7 * 24 * 60 * 60 * 1000;
  }
}
