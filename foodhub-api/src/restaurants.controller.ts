import { Controller, Get, Query } from '@nestjs/common';
import { RESTAURANTS } from './data.js';
 
@Controller('v1/restaurants')
export class RestaurantsController {
  @Get()
  list(@Query('limit') limit = '20', @Query('offset') offset = '0') {
    const l = Number(limit), o = Number(offset);
    return { data: RESTAURANTS.slice(o, o + l), limit: l, offset: o, total: RESTAURANTS.length };
  }
}
