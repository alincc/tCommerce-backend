import { AdminSPFDto } from './spf.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderFilterDto extends AdminSPFDto {
  @IsOptional()
  @Transform((value => Number(value)))
  @IsNumber()
  customerId: number;
}
