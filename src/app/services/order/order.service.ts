import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8084/api/orders';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  createOrder(
    userId: number,
    cart: { productId: number; quantity: number }[]
  ): Observable<any> {
    const orderPayload = {
      userId: userId,
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<any>(this.apiUrl, orderPayload, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error creating order:', error);
    return throwError(
      () => new Error('Order creation failed. Please try again.')
    );
  }
}
