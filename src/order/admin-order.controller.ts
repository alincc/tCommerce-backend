import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { AdminSortingPaginatingDto } from '../shared/dtos/admin/filter.dto';
import { ResponseDto, ResponsePaginationDto } from '../shared/dtos/admin/response.dto';
import { plainToClass } from 'class-transformer';
import { AdminAddOrUpdateOrderDto, AdminOrderDto } from '../shared/dtos/admin/order.dto';


@UsePipes(new ValidationPipe({ transform: true }))
@Controller('admin/orders')
export class AdminOrderController {

  constructor(private orderService: OrderService) {
  }

  @Get()
  async getAllOrders(@Query() sortingPaging: AdminSortingPaginatingDto): Promise<ResponsePaginationDto<AdminOrderDto[]>> {
    const [ results, itemsTotal ] = await Promise.all([this.orderService.getAllOrders(sortingPaging), this.orderService.countOrders()]);
    const pagesTotal = Math.ceil(itemsTotal / sortingPaging.limit);

    return {
      data: plainToClass(AdminOrderDto, results, { excludeExtraneousValues: true }),
      page: sortingPaging.page,
      pagesTotal,
      itemsTotal
    };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<ResponseDto<AdminOrderDto>> {
    const order = await this.orderService.getOrderById(parseInt(id));

    return {
      data: plainToClass(AdminOrderDto, order, { excludeExtraneousValues: true })
    };
  }

  @Post()
  async addOrder(@Body() orderDto: AdminAddOrUpdateOrderDto): Promise<ResponseDto<AdminOrderDto>> {
    const created = await this.orderService.createOrder(orderDto);

    return {
      data: plainToClass(AdminOrderDto, created, { excludeExtraneousValues: true })
    };
  }

  @Put(':id')
  async updateOrder(@Param('id') orderId: number, @Body() orderDto: AdminAddOrUpdateOrderDto): Promise<ResponseDto<AdminOrderDto>> {
    const updated = await this.orderService.updateOrder(orderId, orderDto);

    return {
      data: plainToClass(AdminOrderDto, updated, { excludeExtraneousValues: true })
    };
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: number): Promise<ResponseDto<AdminOrderDto>> {
    const deleted = await this.orderService.deleteOrder(orderId);

    return {
      data: plainToClass(AdminOrderDto, deleted, { excludeExtraneousValues: true })
    };
  }
}