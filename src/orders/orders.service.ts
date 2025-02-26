import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Flowers } from 'src/common/Schemas/flowers.shema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from 'src/common/Schemas/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Flowers.name) private readonly FlowersModel: Model<Flowers>,
    @InjectModel(Orders.name) private readonly OrdersModel: Model<Orders>
  ) { }
  

  create(createOrderDto) {
    this.OrdersModel.create(createOrderDto)
    return { message: 'Order created' };
  }

  findAll(): Promise<Orders[]> {
    return this.OrdersModel.find();
  }
}
