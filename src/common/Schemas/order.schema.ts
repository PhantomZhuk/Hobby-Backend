import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Order {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    totalPrice: number;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 