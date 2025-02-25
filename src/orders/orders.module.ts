import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Flowers, FlowersSchema } from 'src/common/Schemas/flowers.shema';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from 'src/common/Schemas/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Flowers.name, schema: FlowersSchema }]),
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
