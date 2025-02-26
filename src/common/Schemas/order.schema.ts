import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Order {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    img: string;
    
    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    numberReviews: number;

    @Prop({ required: true })
    quantity: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 