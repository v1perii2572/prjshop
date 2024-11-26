import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '';
  showHeaderFooter = true;

  private hiddenRoutes = [
    '/sale-list-product',
    '/sale-edit-product/:id',
    '/sale-add-product',
    '/sale-add-category',
    '/sale-edit-category/:id',
    '/sale-add-user',
    '/sale-edit-user/:id',
    '/vnpay',
    '/momo',
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = !this.isHiddenRoute(event.url);
      }
    });
  }

  private isHiddenRoute(url: string): boolean {
    return this.hiddenRoutes.some((route) => {
      if (route.includes('/:id')) {
        const baseRoute = route.split('/:id')[0];
        return url.startsWith(baseRoute);
      }
      return url === route;
    });
  }
}
