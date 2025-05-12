import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyDetailsPage } from './family-details.page';

describe('FamilyDetailsPage', () => {
  let component: FamilyDetailsPage;
  let fixture: ComponentFixture<FamilyDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
