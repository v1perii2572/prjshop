import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderInfoModel } from '../models/OrderInfoModel';

@Injectable({
  providedIn: 'root',
})
export class MomoService {
  private apiUrl = 'https://localhost:7071/api/Payment';

  constructor(private http: HttpClient) {}

  createPaymentUrl(orderInfo: OrderInfoModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreatePaymentUrl`, orderInfo);
  }
}
