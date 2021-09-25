import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {ManageTransactionsPage} from './manage-transactions.page';

describe('FolderPage', () => {
  let component: ManageTransactionsPage;
  let fixture: ComponentFixture<ManageTransactionsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTransactionsPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTransactionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
