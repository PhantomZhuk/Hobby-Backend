import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FlowersService } from './flowers.service';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateFlowerDto } from './dto/update-flower.dto';
import { Response } from 'express';

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

  @ApiOperation({ summary: 'Update flowers' })
  @ApiResponse({ status: 200, type: CreateFlowerDto })
  @ApiResponse({ status: 400 })
  @Post("updateFlowers")
  updateFlowers(@Body() updateFlowerDto: UpdateFlowerDto, @Res() res: Response) {
    this.flowersService.updateFlowers(updateFlowerDto);
    return res.status(200).json({ message: "Flower updated successfully" });
  }
}
