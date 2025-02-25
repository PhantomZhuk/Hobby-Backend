import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Subscribe {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    date: Date
}

export const SubscribeSchema = SchemaFactory.createForClass(Subscribe);