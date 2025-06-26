import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFamilyPage } from './add-family.page';

describe('AddFamilyPage', () => {
  let component: AddFamilyPage;
  let fixture: ComponentFixture<AddFamilyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFamilyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
