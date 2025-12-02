import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsString()
    email: string;

    @IsString({ message: 'Invalid name' })
    name: string;

    @IsString()
    @MinLength(6)
    password: string;
}