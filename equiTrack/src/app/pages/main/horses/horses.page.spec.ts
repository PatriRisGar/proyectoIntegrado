import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorsesPage } from './horses.page';

describe('HorsesPage', () => {
  let component: HorsesPage;
  let fixture: ComponentFixture<HorsesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HorsesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
