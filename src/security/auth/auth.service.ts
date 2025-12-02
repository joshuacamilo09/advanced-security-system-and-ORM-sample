import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "prisma/PrismaService";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./authDTO/register.dto";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "./authDTO/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    // função interna para gerar hash
    private async hashData(data: string) {
        return bcrypt.hash(data, 12);
    }

    async register(dto: RegisterDto) {
        // verificar se usuário já existe
        const existentUser = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (existentUser) throw new BadRequestException('User already exists');

        // criar hash da senha
        const hashedPassword = await this.hashData(dto.password);

        // criar usuário no banco
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword
            }
        });

        // gerar tokens JWT
        const tokens = await this.getTokens(user.id, user.email, user.role);

        // salvar hashed refresh token na base de dados
        const hashedRt = await this.hashData(tokens.refreshToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedRt
            }
        });

        // não retornamos senha nem hash
        const { password, hashedRt: _, ...rest } = user as any;

        return { user: rest, tokens };
    }

    async login(dto: LoginDTO) {
        // buscar usuário pelo email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (!user) throw new UnauthorizedException('invalid credentials');

        // verificar senha
        const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatch) throw new UnauthorizedException('invalid credentials');

        // gerar tokens
        const tokens = await this.getTokens(user.id, user.email, user.role);

        // atualizar hashed refresh token
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedRt: await this.hashData(tokens.refreshToken)
            }
        });

        // não retornamos senha nem hash
        const { password, hashedRt: _, ...rest } = user as any;

        return { user: rest, tokens };
    }

    async logout(userId: number) {
        // remover hashed refresh token do usuário
        await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { hashedRt: null }
        });
    }

    async getTokens(userId: number, email: string, role: string) {
        // payload do JWT
        const payload = { sub: userId.toString(), email, role };

        // gerar access token
        const access_token = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d',
        });

        // gerar refresh token
        const refreshToken = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d',
        });

        return {
            access_token,
            refreshToken
        };
    }

    async refreshToken(userId: number, refreshToken: string) {
        // buscar usuário pelo id
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        // verificar se usuário existe e tem refresh token
        if (!user || !user.hashedRt)
            throw new UnauthorizedException('invalid credentials');

        // comparar refresh token recebido com hash armazenado
        const tokenMatches = await bcrypt.compare(refreshToken, user.hashedRt);
        if (!tokenMatches)
            throw new UnauthorizedException('invalid credentials');

        // gerar novos tokens e atualizar hash
        const tokens = await this.getTokens(user.id, user.email, user.role);
        const newHashedRt = await this.hashData(tokens.refreshToken);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { hashedRt: newHashedRt }
        });

        return tokens;
    }
}
