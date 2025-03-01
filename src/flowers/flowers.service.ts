import { Injectable } from '@nestjs/common';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flowers } from 'src/common/Schemas/flowers.shema';
import { Model } from 'mongoose';

@Injectable()
export class FlowersService {
    constructor(@InjectModel(Flowers.name) private readonly FlowersModel: Model<Flowers>) {}

    async findAll (): Promise<Flowers[]> {
        return this.FlowersModel.find();
    }
}
