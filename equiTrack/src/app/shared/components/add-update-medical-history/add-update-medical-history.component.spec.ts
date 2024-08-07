import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateMedicalHistoryComponent } from './add-update-medical-history.component';

describe('AddUpdateMedicalHistoryComponent', () => {
  let component: AddUpdateMedicalHistoryComponent;
  let fixture: ComponentFixture<AddUpdateMedicalHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateMedicalHistoryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
