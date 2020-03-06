import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { ResponseDto } from '../shared/dtos/shared/response.dto';
import { ShippingMethodDto } from '../shared/dtos/admin/shipping-method.dto';
import { plainToClass } from 'class-transformer';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('admin/shipping-method')
export class AdminShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {
  }

  @Get()
  async getAllShippingMethods(): Promise<ResponseDto<ShippingMethodDto[]>> {
    const methods = await this.shippingMethodService.getAllShippingMethods();
    return {
      data: plainToClass(ShippingMethodDto, methods, { excludeExtraneousValues: true })
    }
  }

  @Post()
  async createShippingMethod(@Body() methodDto: ShippingMethodDto): Promise<ResponseDto<ShippingMethodDto>> {
    const created = await this.shippingMethodService.createShippingMethod(methodDto);

    return {
      data: plainToClass(ShippingMethodDto, created, { excludeExtraneousValues: true })
    }
  }

  @Put(':id')
  async updateShippingMethod(@Param('id') id: string, @Body() methodDto: ShippingMethodDto): Promise<ResponseDto<ShippingMethodDto>> {
    const updated = await this.shippingMethodService.updateShippingMethod(id, methodDto);

    return {
      data: plainToClass(ShippingMethodDto, updated, { excludeExtraneousValues: true })
    }
  }

  @Delete(':id')
  async deleteShippingMethod(@Param('id') id: string): Promise<ResponseDto<ShippingMethodDto>> {
    const deleted = await this.shippingMethodService.deleteShippingMethod(id);

    return {
      data: plainToClass(ShippingMethodDto, deleted, { excludeExtraneousValues: true })
    }
  }
}
