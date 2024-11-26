import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VnpayService {
  private apiUrl = 'https://localhost:7071/api/Payment';

  constructor(private http: HttpClient) {}

  // Tạo Payment URL
  createPaymentUrl(paymentInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreatePaymentUrl`, paymentInfo);
  }

  // Xử lý callback (nếu cần gọi từ Angular)
  handlePaymentCallback(queryParams: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/PaymentCallback`, {
      params: queryParams,
    });
  }
}
