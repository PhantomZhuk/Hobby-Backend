import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'name' })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ example: 'G1b4o@example.com', description: 'email' })
    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @ApiProperty({ example: 'c99c39dsl/hk<lf94u', description: 'password' })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @ApiProperty({ example: '123456', description: 'password' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string
}