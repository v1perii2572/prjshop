import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from '../../features/cart/models/cart-item.model';
import { CartItemService } from '../../features/cart/service/cart-item.service';
import { ProductService } from '../../features/manager/services/product.service';
import { Product } from '../../features/manager/model/Product.model';
import { MomoService } from '../service/momo.service';

@Component({
  selector: 'app-momo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './momo.component.html',
  styleUrls: ['./momo.component.css'],
})
export class MomoComponent {

}
