// src/app.module.ts
import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import { OrdersController } from './orders.controller.js';
import { AuthController } from './auth.controller.js';
 
@Module({ controllers: [RestaurantsController, OrdersController, AuthController] })
export class AppModule {}
