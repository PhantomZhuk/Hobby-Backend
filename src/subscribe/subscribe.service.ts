import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscribe } from 'src/common/Schemas/subscribe.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubscribeService {
    constructor(@InjectModel("subscribe") private readonly subscribeModel: Model<Subscribe>) {}

    subscribe(email: string) {
        this.subscribeModel.create({email, date: new Date()});
        return {message: "success"};
    }
}
