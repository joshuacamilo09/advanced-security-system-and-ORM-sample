import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString() @IsEmail({}, { message: 'Invalid email' }) email: string;
  @IsString({ message: 'Invalid name' }) name: string;
  @IsString() @Exclude()password: string;
}
export class UpdateUserDto {
  @IsOptional() @IsString() @IsEmail({}, { message: 'Invalid email' }) email?: string;
  @IsOptional() @IsString({ message: 'Invalid name' }) name?: string;
  @IsOptional() @IsString() @Exclude() password?: string;
}
