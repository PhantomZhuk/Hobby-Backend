import { Module } from '@nestjs/common';
import { FlowersModule } from './flowers/flowers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    FlowersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL!),
    OrdersModule,
    SubscribeModule,
    UserModule,
  ]
})
export class AppModule { }
