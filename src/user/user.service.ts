import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/PrismaService';
import { CreateUserDto, UpdateUserDto } from './DTO/DTO';
import * as bcrypt from 'bcrypt';
import { user } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { 
        email: dto.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: dto.password,
        name: dto.name,
      },
    });
  }

  async comparePassword(password: string, userPassword: string) {
    const findPassword = await this.prisma.user.findUnique({
      where: {
        email: userPassword
      },
    });
    if (!findPassword) {
      throw new BadRequestException('Wrond credentials')
    }
    else {
      const isMatch = await bcrypt.compare(password, findPassword.password)
      return isMatch
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new InternalServerErrorException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: dto
    });
  }

  async delete(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async getById(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return existingUser; 
  }

  async getAll(){
    const users = this.prisma.user.findMany();
    if (!users) {
      throw new Error('No users found');
    }
    if ((await users).length === 0) {
      throw new NotFoundException('Empty list');
    }
    return users;
  }

  async findByEmail(email: string): Promise<user> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if (!existingUser) throw new NotFoundException('This email does not exist')
    else {
      return existingUser
    }
  }
}
