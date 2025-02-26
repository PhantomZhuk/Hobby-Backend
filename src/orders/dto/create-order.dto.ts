import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

interface Product {
    id: string,
    name: string,
    price: number
    quantity: number
}

export class CreateOrderDto {
    @ApiProperty({ example: '[{"id": "1", "name": "Product 1", "price": 10, "quantity": 2}]', description: 'products' })
    @IsNotEmpty()
    @IsString()
    products: Product[]

    @ApiProperty({ example: '1', description: 'totalPrice' })
    @IsNotEmpty()
    @IsString()
    totalPrice: number

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
