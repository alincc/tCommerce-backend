import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AdminCustomerController } from './admin-customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerModel } from './models/customer.model';
import { ClientCustomerController } from './client-customer.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

const customerModel = {
  name: CustomerModel.modelName,
  schema: CustomerModel.schema,
  collection: Customer.collectionName
};

@Module({
  imports: [
    MongooseModule.forFeature([customerModel]),
    forwardRef(() => AuthModule),
    EmailModule
  ],
  providers: [CustomerService],
  controllers: [AdminCustomerController, ClientCustomerController],
  exports: [CustomerService]
})
export class CustomerModule {}
