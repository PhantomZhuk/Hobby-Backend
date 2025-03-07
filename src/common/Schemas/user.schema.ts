import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    phone: string

    @Prop({ required: true, default: false })
    isAdmin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);