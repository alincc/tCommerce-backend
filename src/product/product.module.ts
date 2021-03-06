import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductModel } from './models/product.model';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import { PageRegistryModule } from '../page-registry/page-registry.module';
import { ClientProductController } from './client-product.controller';
import { AdminProductController } from './admin-product.controller';
import { ProductReviewModule } from '../reviews/product-review/product-review.module';
import { CategoryModule } from '../category/category.module';
import { AttributeModule } from '../attribute/attribute.module';
import { CurrencyModule } from '../currency/currency.module';

const productModel = {
  name: ProductModel.modelName,
  schema: ProductModel.schema,
  collection: Product.collectionName
};

@Module({
  imports: [
    MongooseModule.forFeature([productModel]),
    InventoryModule,
    AttributeModule,
    PageRegistryModule,
    CurrencyModule,
    forwardRef(() => ProductReviewModule),
    forwardRef(() => CategoryModule)
  ],
  controllers: [AdminProductController, ClientProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
