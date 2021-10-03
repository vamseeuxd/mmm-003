import {Component, Input, OnInit} from '@angular/core';
import {
  ITransaction,
  ITransactionDoc,
  RepeatOption,
  TransactionService
} from '../shared/services/transaction-service/transaction.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModalController} from '@ionic/angular';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoaderService} from '../shared/services/loader/loader.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-or-edit-transaction',
  templateUrl: './add-or-edit-transaction.page.html',
  styleUrls: ['./add-or-edit-transaction.page.scss'],
})
export class AddOrEditTransactionPage implements OnInit {

  @Input() type: 'expenses' | 'income' = 'expenses';
  @Input() isEdit = false;
  @Input() transaction: ITransaction;
  id = '';
  action = 'Add new';
  transactionDoc: ITransactionDoc = {
    name: '',
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
  private dialogRef: MatDialogRef<unknown>;

  constructor(
    public modalController: ModalController,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public matSnackBar: MatSnackBar,
    public loader: LoaderService,
    public transactionService: TransactionService,
    private firestore: AngularFirestore,
  ) {
    this.repeatDropDownConfig.day = Array.from(Array(30).keys());
    this.repeatDropDownConfig.week = Array.from(Array(52).keys());
    this.repeatDropDownConfig.month = Array.from(Array(12).keys());
    this.repeatDropDownConfig.year = Array.from(Array(10).keys());
  }

  ngOnInit(): void {
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
      this.action = 'Add New';
    }
  }

  getDataForUpdate() {
    if (this.isEdit && this.transaction) {
      this.transactionDoc = {
        ...this.transaction.fireStoreDoc,
        startDate: new Date(this.transaction.fireStoreDoc.startDate),
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
    const start = expensesForm.value.startDate.getTime();
    return {
      ...expensesForm.value,
      dates: {
        start,
        end
      },
      uid: this.loader.user.providerData[0].uid,
      noOfInstallments: Number(expensesForm.value.noOfInstallments),
      startDate: expensesForm.value.startDate.getTime()
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
        expensesForm.resetForm({});
        await this.router.navigate(['manage-transactions']);
      } else {
        await this.firestore.collection<ITransactionDoc>('transactions').add(dataToSave);
        this.matSnackBar.open(`New ${this.type.toLocaleUpperCase()} added successfully`, this.type.toLocaleUpperCase(), {duration: 1000});
        expensesForm.resetForm({});
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

  async goToManageTransactionPage(expensesForm: NgForm) {
    expensesForm.resetForm({});
    await this.router.navigate(['manage-transactions']);
  }
}
