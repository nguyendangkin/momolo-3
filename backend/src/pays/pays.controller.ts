import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaysService } from './pays.service';
import { CreatePayDto } from './dto/create-pay.dto';
import { GetDonorsDto } from 'src/pays/dto/get-donors.dto';

@Controller('pays')
export class PaysController {
  constructor(private readonly paysService: PaysService) {}

  @Post('donate')
  create(@Body() data: CreatePayDto) {
    return this.paysService.create(data);
  }

  @Post('receive-hook')
  receiveHook(@Body() data: any) {
    return this.paysService.receiveHook(data);
  }

  @Get('get-all')
  findAll(@Query() query: GetDonorsDto) {
    return this.paysService.findAll(query);
  }

  @Post('receive-hook-2')
  receiveHook2(@Body() data: any) {
    console.log(data);
    // return this.paysService.receiveHook(data);
  }
}
