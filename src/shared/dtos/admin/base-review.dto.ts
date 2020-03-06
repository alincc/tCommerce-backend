import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { AdminMediaDto } from './media.dto';

export class BaseReviewDto {
  @Expose()
  @Transform(((value, obj) => value ? value : obj._id))
  id: number;

  @Expose()
  @IsBoolean()
  isEnabled: boolean;

  @Expose()
  @IsOptional()
  votesCount: number;

  @Expose()
  @IsOptional()
  hasClientVoted: boolean;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  text: string;

  @Expose()
  @IsOptional()
  @IsString()
  email: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  customerId: number;

  @Expose()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder: number;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminMediaDto)
  medias: AdminMediaDto[];

  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}
