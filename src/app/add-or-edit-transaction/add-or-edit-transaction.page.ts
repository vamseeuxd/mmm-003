import {Component, Input, ViewChild} from '@angular/core';
import {
  ITransaction,
  ITransactionDoc,
  RepeatOption,
  TransactionService
} from '../shared/services/transaction-service/transaction.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {IonContent, ModalController} from '@ionic/angular';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoaderService} from '../shared/services/loader/loader.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
// tslint:disable-next-line:no-duplicate-imports
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
// @ts-ignore
import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ManageCategoriesService} from '../shared/services/manage-categories/manage-categories.service';
import {ManageExpensesForService} from '../shared/services/manage-expenses-for.service';
import {ManagePayerService} from '../shared/services/manage-payer/manage-payer.service';
import {ManagePayeeService} from '../shared/services/manage-payee/manage-payee.service';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-or-edit-transaction',
  templateUrl: './add-or-edit-transaction.page.html',
  styleUrls: ['./add-or-edit-transaction.page.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AddOrEditTransactionPage {

  @Input() type: 'expenses' | 'income' = 'expenses';
  @Input() isEdit = false;
  @Input() transaction: ITransaction;
  @ViewChild('addOrEditTransactionContent') addOrEditTransactionContent: IonContent;
  showExpensesForm = false;
  id = '';
  action = 'Add new';
  transactionDoc: ITransactionDoc = {
    name: '',
    category: '',
    expensesFor: '',
    payer: '',
    payee: '',
    amount: null,
    type: 'expenses',
    startDate: null,
    endDate: null,
    repeatInterval: 1,
    repeatOption: 'month',
    noOfInstallments: 1,
  };
  repeatDropDownConfig = {
    day: [],
    week: [],
    month: [],
    year: [],
  };

  modalData: {
    repeatInterval: number;
    repeatOption: RepeatOption;
  } = {
    repeatInterval: 1,
    repeatOption: 'day',
  };
  oldRepeatOption: RepeatOption = 'month';
  scrollEvents = false;
  private dialogRef: MatDialogRef<unknown>;

  constructor(
    public modalController: ModalController,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public matSnackBar: MatSnackBar,
    public loader: LoaderService,
    public transactionService: TransactionService,
    public manageCategoriesService: ManageCategoriesService,
    public manageExpensesForService: ManageExpensesForService,
    public managePayerService: ManagePayerService,
    public managePayeeService: ManagePayeeService,
    private firestore: AngularFirestore,
  ) {
    this.repeatDropDownConfig.day = Array.from(Array(30).keys());
    this.repeatDropDownConfig.week = Array.from(Array(52).keys());
    this.repeatDropDownConfig.month = Array.from(Array(12).keys());
    this.repeatDropDownConfig.year = Array.from(Array(10).keys());
  }

  ionViewDidLeave(): void {
    this.scrollEvents = false;
  }

  ionViewDidEnter(): void {
    const addOrEditTransactionPageScrollTop = window.sessionStorage.getItem('addOrEditTransactionPageScrollTop');
    if (addOrEditTransactionPageScrollTop) {
      this.addOrEditTransactionContent.scrollByPoint(0, Number(addOrEditTransactionPageScrollTop), 0).then(() => {
        this.scrollEvents = true;
      });
    }
    this.transactionDoc.category = this.manageCategoriesService.lastAddedId;
    this.transactionDoc.expensesFor = this.manageExpensesForService.lastAddedId;
    this.transactionDoc.payer = this.managePayerService.lastAddedId;
    this.transactionDoc.payee = this.managePayeeService.lastAddedId;
  }

  ionViewWillEnter(): void {
    this.showExpensesForm = false;
    this.isEdit = false;
    this.type = this.route.snapshot.paramMap.get('type') === 'expenses' ? 'expenses' : 'income';
    this.id = this.route.snapshot.paramMap.get('id');
    const selectedDate = this.route.snapshot.paramMap.get('selectedDate');
    if (this.id) {
      this.isEdit = true;
      this.action = 'Update';
      if (this.transactionService.transactions.length > 0) {
        this.transaction = this.transactionService.getTransactionById(this.id, selectedDate ? Number(selectedDate) : null);
        this.getDataForUpdate();
      } else {
        this.transactionService.transactionsChanged$.subscribe(() => {
          this.transaction = this.transactionService.getTransactionById(this.id);
          this.getDataForUpdate();
        });
      }
    } else {
      setTimeout(() => {
        this.showExpensesForm = true;
      });
      this.action = 'Add New';
    }
  }

  getDataForUpdate() {
    if (this.isEdit && this.transaction) {
      this.showExpensesForm = true;
      this.transactionDoc = {
        ...this.transaction.fireStoreDoc,
        startDate: new Date(this.transaction.fireStoreDoc.startDate),
        category: this.manageCategoriesService.lastAddedId,
      };
      this.modalData = {
        repeatInterval: this.transaction.fireStoreDoc.repeatInterval,
        repeatOption: this.transaction.fireStoreDoc.repeatOption,
      };
      this.oldRepeatOption = this.transaction.fireStoreDoc.repeatOption;
      this.updateEndDate();
    }
  }

  updateEndDate(): void {
    setTimeout(() => {
      const date = moment(this.transactionDoc.startDate);
      const duration: any = (this.transactionDoc.repeatInterval * (this.transactionDoc.noOfInstallments - 1));
      date.add(duration, this.transactionDoc.repeatOption);
      this.transactionDoc.endDate = date.toDate();
    }, 50);
  }

  openDialog(template: any): void {
    if (this.oldRepeatOption !== 'never') {
      this.modalData.repeatOption = this.oldRepeatOption;
      this.modalData.repeatInterval = this.transactionDoc.repeatInterval;
    } else {
      this.transactionDoc.repeatOption = 'day';
    }
    this.dialogRef = this.dialog.open(template, {width: '400px'});
  }

  getRepeatOptionLabel(option: string, isOpen: boolean) {
    if (isOpen) {
      return `Every ${option}`;
    }
    // eslint-disable-next-line max-len
    return `Every ${(this.transactionDoc.repeatInterval === 1) ? '' : this.transactionDoc.repeatInterval} ${option}${(this.transactionDoc.repeatInterval === 1) ? '' : 's'}`;
  }

  repeatOptionOkClick() {
    this.transactionDoc.repeatOption = this.modalData.repeatOption;
    this.transactionDoc.repeatInterval = this.modalData.repeatInterval;
    this.dialogRef.close();
    this.updateEndDate();
  }

  getDateToSave(expensesForm: NgForm) {
    const end = expensesForm.value.endDate.getTime();
    const start = expensesForm.value.startDate.toDate().getTime(); // expensesForm.value.startDate.getTime();
    return {
      ...expensesForm.value,
      dates: {
        start,
        end
      },
      uid: this.loader.user.providerData[0].uid,
      noOfInstallments: Number(expensesForm.value.noOfInstallments),
      startDate: expensesForm.value.startDate.toDate().getTime() // expensesForm.value.startDate.getTime()
    };
  }

  async saveExpenses(expensesForm: NgForm) {
    const loaderId = this.loader.show(true, 'saveExpenses');
    const dataToSave = this.getDateToSave(expensesForm);
    delete dataToSave.endDate;
    delete dataToSave.id;
    try {
      if (this.isEdit) {
        const docRef = this.firestore.collection<ITransactionDoc>('transactions').doc(this.transaction.fireStoreDoc.id).ref;
        await docRef.update(dataToSave);
        this.matSnackBar.open(`${this.type.toLocaleUpperCase()} Updated successfully`, this.type.toLocaleUpperCase(), {duration: 1000});
        await this.router.navigate(['manage-transactions']);
      } else {
        await this.firestore.collection<ITransactionDoc>('transactions').add(dataToSave);
        this.matSnackBar.open(`New ${this.type.toLocaleUpperCase()} added successfully`, this.type.toLocaleUpperCase(), {duration: 1000});
        await this.router.navigate(['manage-transactions']);
      }
    } catch (e) {
      if (this.isEdit) {
        this.matSnackBar.open(`Error while updating ${this.type.toLocaleUpperCase()}`, this.type.toLocaleUpperCase(), {duration: 1000});
      } else {
        this.matSnackBar.open(`Error while Adding ${this.type.toLocaleUpperCase()}`, this.type.toLocaleUpperCase(), {duration: 1000});
      }
    }
    await this.loader.hide(loaderId);
    await this.modalController.dismiss();
  }

  async goToManageTransactionPage() {
    this.showExpensesForm = false;
    await this.router.navigate(['manage-transactions']);
  }

  saveScrollPosition($event: any) {
    window.sessionStorage.setItem('addOrEditTransactionPageScrollTop', $event.detail.scrollTop);
  }
}
