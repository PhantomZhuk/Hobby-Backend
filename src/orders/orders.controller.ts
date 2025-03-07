import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 200, type: CreateOrderDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post("/create")
  create(@Body() createOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: [CreateOrderDto] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get("/all")
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, type: CreateOrderDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post("/update")
  update(@Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, type: CreateOrderDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    return this.ordersService.delete(id);
  }
}
