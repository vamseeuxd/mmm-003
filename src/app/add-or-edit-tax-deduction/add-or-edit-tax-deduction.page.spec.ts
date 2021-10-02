import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOrEditTaxDeductionPage } from './add-or-edit-tax-deduction.page';

describe('AddOrEditTaxDeductionPage', () => {
  let component: AddOrEditTaxDeductionPage;
  let fixture: ComponentFixture<AddOrEditTaxDeductionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditTaxDeductionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOrEditTaxDeductionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
