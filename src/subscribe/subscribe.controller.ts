import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @ApiOperation({ summary: 'Subscribe' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  @Post()
  subscribe(@Body() createSubscribeDto: CreateSubscribeDto) {
    return this.subscribeService.subscribe(createSubscribeDto);
  }
}
