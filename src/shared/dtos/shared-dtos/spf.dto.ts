import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { queryParamArrayDelimiter, sortFieldRegex } from '../../constants';
import { Transform } from 'class-transformer';

export interface IFilter {
  fieldName: string;
  value: string | boolean;
}

export interface ISorting {
  [fieldName: string]: 'asc' | 'desc';
}

const defaultSorting: ISorting = { '_id': 'desc' };

export abstract class SortingPaginatingFilterDto {

  @IsString()
  @IsOptional()
  sort?: string = '';

  sortFilter: any;

  getSortAsObj(): ISorting {
    let obj = { };

    this.sort.split(queryParamArrayDelimiter).forEach(field => {
      const matches = field.match(sortFieldRegex);
      if (matches === null) {
        return;
      }

      const sortOrder = matches[1] === '-' ? 'desc' : 'asc';
      const sortField = matches[2] === 'id' ? '_id' : matches[2];

      obj[sortField] = sortOrder;
    });

    if (Object.keys(obj).length === 0) {
      obj = defaultSorting;
    }

    return obj;
  }

  @IsOptional()
  @Transform((value => Number(value)))
  @Min(0)
  limit: number = 20;

  @IsOptional()
  @Transform((value => Number(value)))
  @IsPositive()
  page: number = 1;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  abstract getNormalizedFilters(): IFilter[];
}
