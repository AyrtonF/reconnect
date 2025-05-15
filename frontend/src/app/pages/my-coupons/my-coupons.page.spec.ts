import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCouponsPage } from './my-coupons.page';

describe('MyCouponsPage', () => {
  let component: MyCouponsPage;
  let fixture: ComponentFixture<MyCouponsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCouponsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
