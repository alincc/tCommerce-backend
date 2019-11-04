import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { AdminAddOrUpdateProductDto, AdminResponseProductDto } from '../shared/dtos/admin/product.dto';
import { BackendProductService } from './backend-product.service';
import { AdminResponseCategoryDto } from '../shared/dtos/admin/category.dto';
import { plainToClass } from 'class-transformer';
import { BackendProduct } from './models/product.model';

type BackendProductWithQty = BackendProduct & { qty?: number };

@Controller('admin/products')
export class BackendAdminProductController {

  constructor(private readonly productsService: BackendProductService) {
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getProducts() {
    const backendProducts = await this.productsService.getProducts();
    const backendProductsWithQty = await this.populateProductsWithQty(backendProducts);

    return plainToClass(AdminResponseProductDto, backendProductsWithQty, { excludeExtraneousValues: true });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id);
    const productsWithQty = await this.populateProductsWithQty([product.toJSON()]);

    return plainToClass(AdminResponseProductDto, productsWithQty[0], { excludeExtraneousValues: true });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async addProduct(@Body() productDto: AdminAddOrUpdateProductDto) {
    const created = await this.productsService.createProduct(productDto);

    return plainToClass(AdminResponseCategoryDto, created, { excludeExtraneousValues: true });
  }

  private async populateProductsWithQty(products: BackendProduct[]): Promise<BackendProductWithQty[]> {
    return Promise.all(
      products.map(async product => {
        const qty = await this.productsService.getProductQty(product);
        return {
          ...product,
          qty
        } as BackendProductWithQty;
      })
    );
  }
}
