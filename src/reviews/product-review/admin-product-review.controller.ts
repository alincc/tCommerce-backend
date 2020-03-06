import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { ResponseDto } from '../../shared/dtos/shared/response.dto';
import { plainToClass } from 'class-transformer';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { ProductReviewDto } from '../../shared/dtos/admin/product-review.dto';
import { ProductReviewService } from './product-review.service';
import { ProductReviewFilterDto } from '../../shared/dtos/admin/product-review-filter.dto';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('admin/product-reviews')
export class AdminProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {
  }

  @Get()
  async findAllReviews(@Query() spf: ProductReviewFilterDto): Promise<ResponseDto<ProductReviewDto[]>> {

    if (spf.productId) {

      return {
        data: await this.productReviewService.findReviewsByProductId(spf.productId)
      };

    } else {
      return this.productReviewService.getReviewsResponse(spf);
    }
  }

  @Get(':id')
  async findReview(@Param('id') reviewId: string): Promise<ResponseDto<ProductReviewDto>> {
    const review = await this.productReviewService.findReview(reviewId);
    return {
      data: plainToClass(ProductReviewDto, review, { excludeExtraneousValues: true })
    };
  }

  @Post('counter') // todo remove this and all counter updates after migrate
  updateCounter() {
    return this.productReviewService.updateCounter();
  }

  @Post('media')
  async uploadMedia(@Request() request: FastifyRequest, @Response() reply: FastifyReply<ServerResponse>) {
    const media = await this.productReviewService.uploadMedia(request);

    reply.status(201).send(media);
  }

  @Post()
  async createProductReview(@Body() productReviewDto: ProductReviewDto, @Query('migrate') migrate: any): Promise<ResponseDto<ProductReviewDto>> {
    const review = await this.productReviewService.createReview(productReviewDto, migrate);
    return {
      data: plainToClass(ProductReviewDto, review, { excludeExtraneousValues: true })
    }
  }

  @Put(':id')
  async updateProductReview(@Param('id') reviewId: string, @Body() productReviewDto: ProductReviewDto): Promise<ResponseDto<ProductReviewDto>> {
    const review = await this.productReviewService.updateReview(reviewId, productReviewDto);
    return {
      data: plainToClass(ProductReviewDto, review, { excludeExtraneousValues: true })
    }
  }

  @Delete(':id')
  async deleteProductReview(@Param('id') reviewId: string): Promise<ResponseDto<ProductReviewDto>> {
    const review = await this.productReviewService.deleteReview(reviewId);

    return {
      data: plainToClass(ProductReviewDto, review, { excludeExtraneousValues: true })
    }
  }
}
