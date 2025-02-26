import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./order.schema";

@Schema()
export class Orders {
    @Prop({ type: [OrderSchema] ,required: true })
    orders: Order[]

    @Prop({ required: true })
    totalPrice: Number

    @Prop({ required: true })
    date: Date

    @Prop({ required: true })
    customerName: String

    @Prop({ required: true })
    customerPhone: String

    @Prop({ required: true })
    customerEmail: String
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);