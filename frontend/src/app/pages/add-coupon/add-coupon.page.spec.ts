import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCouponPage } from './add-coupon.page';

describe('AddCouponPage', () => {
  let component: AddCouponPage;
  let fixture: ComponentFixture<AddCouponPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
