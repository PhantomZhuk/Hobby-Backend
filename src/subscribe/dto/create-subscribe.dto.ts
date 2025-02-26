import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateSubscribeDto {
    @ApiProperty({ example: 'G1b4o@example.com', description: 'email' })
    @IsNotEmpty()
    @IsEmail()
    email: string
}
