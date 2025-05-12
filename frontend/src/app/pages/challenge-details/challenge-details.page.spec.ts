import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeDetailsPage } from './challenge-details.page';

describe('ChallengeDetailsPage', () => {
  let component: ChallengeDetailsPage;
  let fixture: ComponentFixture<ChallengeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
