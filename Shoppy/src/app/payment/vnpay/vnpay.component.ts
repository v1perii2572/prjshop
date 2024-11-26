import { Component } from '@angular/core';
import { VnpayService } from '../service/vnpay.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vnpay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vnpay.component.html',
  styleUrls: ['./vnpay.component.css'],
})
export class VnpayComponent {
  paymentInfo = {
    orderType: '',
    amount: 0,
    orderDescription: '',
    name: '',
  };

  constructor(private vnPayService: VnpayService, private router: Router) {}

  submitPayment() {
    const { orderType, amount, orderDescription, name } = this.paymentInfo;

    if (!orderType || amount <= 0 || !orderDescription || !name) {
      alert('Please fill in all fields with valid information.');
      return;
    }

    this.vnPayService.createPaymentUrl(this.paymentInfo).subscribe({
      next: (response) => {
        if (response && response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          alert('Payment URL not generated. Please try again.');
        }
      },
      error: (err) => {
        console.error('Error creating payment URL:', err);
        alert(
          'Failed to create payment URL. Please check your data or try again later.'
        );
      },
    });
  }
}
