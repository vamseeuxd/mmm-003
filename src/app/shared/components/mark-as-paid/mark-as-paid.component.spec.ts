import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {MarkAsPaidComponent} from './mark-as-paid.component';

describe('MarkAsPaidComponent', () => {
  let component: MarkAsPaidComponent;
  let fixture: ComponentFixture<MarkAsPaidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarkAsPaidComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAsPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
