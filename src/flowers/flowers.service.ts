import { Injectable } from '@nestjs/common';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flowers } from 'src/common/Schemas/flowers.schema';
import { Model } from 'mongoose';
import { UpdateFlowerDto } from './dto/update-flower.dto';

@Injectable()
export class FlowersService {
    constructor(@InjectModel(Flowers.name) private readonly FlowersModel: Model<Flowers>) { }

    async findAll(): Promise<Flowers[]> {
        return this.FlowersModel.find();
    }

    async updateFlowers(updateFlowerDto: UpdateFlowerDto) {
        const flower = await this.FlowersModel.findById(updateFlowerDto._id);
        if (!flower) {
            throw new Error("Flower not found");
        }

        await this.FlowersModel.findByIdAndUpdate(updateFlowerDto._id, updateFlowerDto);

        return { message: "Flower updated successfully" };
    }
}
