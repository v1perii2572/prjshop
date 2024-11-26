import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: SaleProductListComponent;
  let fixture: ComponentFixture<SaleProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleProductListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
