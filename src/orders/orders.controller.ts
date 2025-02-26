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
}
