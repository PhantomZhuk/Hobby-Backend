import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({ example: 'x6c87b67v87dxf678', description: 'productId' })
    @IsNotEmpty()
    @IsString()
    productId: string

    @ApiProperty({ example: '1', description: 'quantity' })
    @IsNotEmpty()
    @IsString()
    quantity: string

    @ApiProperty({ example: '1', description: 'totalPrice' })
    @IsNotEmpty()
    @IsString()
    totalPrice: string

    @ApiProperty({ example: '01.01.2025', description: 'date' })
    @IsNotEmpty()
    @IsString()
    date: string

    @ApiProperty({ example: 'John Doe', description: 'customerName' })
    @IsNotEmpty()
    @IsString()
    customerName: string

    @ApiProperty({ example: '+380501234567', description: 'customerPhone' })
    @IsNotEmpty()
    @IsString()
    customerPhone: string

    @ApiProperty({ example: 'G1b4o@example.com', description: 'customerEmail' })
    @IsNotEmpty()
    @IsString()
    customerEmail: string
}
