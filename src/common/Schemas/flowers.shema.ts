import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Flowers extends Document {
    @Prop({ required: true })
    img: String

    @Prop({ required: true })
    name: String

    @Prop({ required: true })
    price: Number

    @Prop({ required: true })
    numberReviews: Number

    @Prop({ required: true })
    rating: Number

    @Prop({ required: true })
    aos: Number
}

export const FlowersSchema = SchemaFactory.createForClass(Flowers);