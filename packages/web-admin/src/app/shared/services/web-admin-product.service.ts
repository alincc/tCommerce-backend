import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminAddOrUpdateProductDto,
  AdminResponseProductDto
} from '../../../../../backend/src/shared/dtos/admin/product.dto';

@Injectable()
export class WebAdminProductService {

  constructor(private http: HttpClient) {
  }

  fetchProducts(): Observable<AdminResponseProductDto[]> {
    return this.http.get<AdminResponseProductDto[]>('http://localhost:3500/api/v1/admin/products');
  }

  fetchProduct(id: string): Observable<AdminResponseProductDto> {
    return this.http.get<AdminResponseProductDto>(`http://localhost:3500/api/v1/admin/products/${id}`);
  }

  addNewProduct(dto: AdminAddOrUpdateProductDto): Observable<AdminResponseProductDto> {
    return this.http.post<AdminResponseProductDto>(`http://localhost:3500/api/v1/admin/products`, dto);
  }

  updateProduct(productId: number, dto: AdminAddOrUpdateProductDto): Observable<AdminResponseProductDto> {
    return this.http.put<AdminResponseProductDto>(`http://localhost:3500/api/v1/admin/products/${productId}`, dto);
  }
}
