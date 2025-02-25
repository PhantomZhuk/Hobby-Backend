import { Module } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { FlowersController } from './flowers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flowers, FlowersSchema } from 'src/common/Schemas/flowers.shema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Flowers.name, schema: FlowersSchema }])],
  controllers: [FlowersController],
  providers: [FlowersService],
})
export class FlowersModule {}
