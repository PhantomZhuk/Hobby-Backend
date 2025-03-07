import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFlowerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
    
    @IsString()
    @IsNotEmpty()
    img: string;

    @IsNumber()
    @IsNotEmpty()
    numberReviews: number;

    @IsNumber()
    @IsNotEmpty()
    rating: number;

    @IsNumber()
    @IsNotEmpty()
    aos: number;
}
