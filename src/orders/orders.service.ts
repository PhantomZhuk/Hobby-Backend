import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Flowers } from 'src/common/Schemas/flowers.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from 'src/common/Schemas/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Flowers.name) private readonly FlowersModel: Model<Flowers>,
    @InjectModel(Orders.name) private readonly OrdersModel: Model<Orders>
  ) { }

  create(createOrderDto: CreateOrderDto) {
    this.OrdersModel.create(createOrderDto)
    return { message: 'Order created' };
  }

  findAll(): Promise<Orders[]> {
    return this.OrdersModel.find();
  }

  async update(updateOrderDto: UpdateOrderDto) {
    const order = await this.OrdersModel.findById(updateOrderDto._id);
    if (!order) {
      throw new Error("Order not found");
    }
    await this.OrdersModel.findByIdAndUpdate(updateOrderDto._id, updateOrderDto);
    return { message: "Order updated successfully" };
  }

  async delete(id: string) {
    const order = await this.OrdersModel.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await this.OrdersModel.findByIdAndDelete(id);
    return { message: "Order deleted successfully" };
  }
}
