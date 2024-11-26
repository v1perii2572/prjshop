import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UserProfileComponent } from './features/user/user-profile/user-profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderComponent } from './components/order/order.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogsDetailsComponent } from './components/blogs-details/blogs-details.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { ForgotpasswordComponent } from './features/auth/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './features/auth/resetpassword/resetpassword.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { ProductDetailComponent } from './features/product/product-detail/product-detail.component';
import { SaleProductListComponent } from './features/manager/sale/product-list/product-list.component';
import { ProductEditComponent } from './features/manager/sale/product-edit/product-edit.component';
import { ProductAddComponent } from './features/manager/sale/product-add/product-add.component';
import { CategoryAddComponent } from './features/manager/sale/category-add/category-add.component';
import { CategoryEditComponent } from './features/manager/sale/category-edit/category-edit.component';
import { UserListComponent } from './features/manager/sale/user-list/user-list.component';
import { UserEditComponent } from './features/manager/sale/user-edit/user-edit.component';
import { VnpayComponent } from './payment/vnpay/vnpay.component';
import { MomoComponent } from './payment/momo/momo.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'reset-password', component: ResetpasswordComponent },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'blogs-details',
    component: BlogsDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['User', 'Admin'] },
  },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'product-details/:id', component: ProductDetailComponent },
  { path: 'sale-list-product', component: SaleProductListComponent },
  { path: 'sale-edit-product/:id', component: ProductEditComponent },
  { path: 'sale-add-product', component: ProductAddComponent },
  { path: 'sale-add-category', component: CategoryAddComponent },
  { path: 'sale-edit-category/:id', component: CategoryEditComponent },
  { path: 'sale-add-user', component: UserListComponent },
  { path: 'sale-edit-user/:id', component: UserEditComponent },
  { path: 'vnpay', component: VnpayComponent },
  { path: 'momo', component: MomoComponent },
];
