import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('flowers')
export class FlowersController {
  constructor(private readonly flowersService: FlowersService) {}

  @ApiOperation({ summary: 'Get all flowers' })
  @ApiResponse({ status: 200, type: [CreateFlowerDto] })
  @ApiResponse({ status: 400 })
  @Get("/allFlowers")
  findAll() {
    return this.flowersService.findAll();
  }
}
