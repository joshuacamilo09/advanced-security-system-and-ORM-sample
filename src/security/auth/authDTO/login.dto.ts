import { IsEmail, IsString } from "class-validator";

export class LoginDTO {
    @IsString() @IsEmail({}, { message: 'Invalid email' }) email: string;
    @IsString()password: string;
}