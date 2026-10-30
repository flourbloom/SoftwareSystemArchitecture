import { Body, ConflictException, Controller, Get, Headers, HttpCode, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ArrayNotEmpty, IsIn, IsInt, IsString } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { IDEMPOTENCY, ORDERS, RESTAURANTS } from './data.js';

export class CreateOrderDto {
    @IsInt() restaurantId: number;
    @ArrayNotEmpty() @IsString({ each: true }) items: string[];
}

const ALLOWED_STATUSES = ['PLACED', 'COOKING', 'DELIVERING', 'DELIVERED', 'CANCELLED'] as const;
export type OrderStatus = (typeof ALLOWED_STATUSES)[number];

export class UpdateOrderStatusDto {
    @IsIn(ALLOWED_STATUSES)
    status: OrderStatus;
}

@Controller('v1/orders')
export class OrdersController {
    @Post()
    @HttpCode(201)
    create(@Body() dto: CreateOrderDto,
        @Headers('idempotency-key') key: string | undefined,
        @Res({ passthrough: true }) res: Response) {
        if (key && IDEMPOTENCY  .has(key)) {
            res.status(200);                         // same request again: return the first result
            return ORDERS.get(IDEMPOTENCY.get(key)!);
        }
        if (!RESTAURANTS.some(r => r.id === dto.restaurantId)) {
            throw new NotFoundException('restaurant not found');
        }
        const order = { id: randomUUID(), status: 'PLACED', ...dto };
        ORDERS.set(order.id, order);
        if (key) IDEMPOTENCY.set(key, order.id);
        return order;
    }

    @Get(':id')
    getOrder(@Param('id') id: string) {
        const order = ORDERS.get(id);
        if (!order) {
            throw new NotFoundException('order not found');
        }
        return order;
    }

    @Patch(':id')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        // console.log(dto)
        const order = ORDERS.get(id);
        if (!order) {
            throw new NotFoundException('order not found');
        }

        const currentStatus = order.status;
        const nextStatus = dto.status;

        const isValidTransition =
            (currentStatus === 'PLACED' && (nextStatus === 'COOKING' || nextStatus === 'CANCELLED')) ||
            (currentStatus === 'COOKING' && nextStatus === 'DELIVERING') ||
            (currentStatus === 'DELIVERING' && nextStatus === 'DELIVERED');

        if (!isValidTransition) {
            throw new ConflictException(`Invalid status transition from ${currentStatus} to ${nextStatus}`);
        }

        order.status = nextStatus;
        ORDERS.set(id, order);
        return order;
    }
}
