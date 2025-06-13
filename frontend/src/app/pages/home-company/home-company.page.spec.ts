import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeCompanyPage } from './home-company.page';

describe('HomeCompanyPage', () => {
  let component: HomeCompanyPage;
  let fixture: ComponentFixture<HomeCompanyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
