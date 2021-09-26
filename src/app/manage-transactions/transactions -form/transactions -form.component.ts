import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import {ITransaction, ITransactionDoc, RepeatOption} from '../../shared/transaction-service/transaction.service';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './transactions -form.component.html',
  styleUrls: ['./transactions -form.component.scss'],
})
export class TransactionsFormComponent implements OnInit {

  @Input() type: 'expenses' | 'income' = 'expenses';
  @Input() isEdit = false;
  @Input() transaction: ITransaction;
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
    private firestore: AngularFirestore,
  ) {
    this.repeatDropDownConfig.day = Array.from(Array(30).keys());
    this.repeatDropDownConfig.week = Array.from(Array(52).keys());
    this.repeatDropDownConfig.month = Array.from(Array(12).keys());
    this.repeatDropDownConfig.year = Array.from(Array(10).keys());
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.transactionDoc = {
        name: this.transaction.fireStoreDoc.name,
        amount: this.transaction.fireStoreDoc.amount,
        type: this.transaction.fireStoreDoc.type,
        startDate: this.transaction.fireStoreDoc.dates.start,
        endDate: this.transaction.fireStoreDoc.dates.end,
        repeatInterval: this.transaction.fireStoreDoc.repeatInterval,
        repeatOption: this.transaction.fireStoreDoc.repeatOption,
        noOfInstallments: this.transaction.fireStoreDoc.noOfInstallments,
      };
      this.modalData = {
        repeatInterval: this.transaction.fireStoreDoc.repeatInterval,
        repeatOption: this.transaction.fireStoreDoc.repeatOption,
      };
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

  async saveExpenses(expensesForm: NgForm) {
    const loaderId = window.loader.show();
    const end = expensesForm.value.endDate.getTime();
    const start = expensesForm.value.startDate.getTime();
    console.log(moment(end).format('DD-MMMM-yyyy'));
    delete expensesForm.value.endDate;
    await this.firestore.collection<ITransactionDoc>('transactions').add({
      ...expensesForm.value,
      dates: {
        start,
        end
      },
      uid: window.loader.user.providerData[0].uid,
      noOfInstallments: Number(expensesForm.value.noOfInstallments),
      startDate: expensesForm.value.startDate.getTime()
    });
    // moment(transaction.startDate).add(key * transaction.repeatInterval, transaction.repeatOption).format('DD-MMM-yyyy')
    await window.loader.hide(loaderId);
    await this.modalController.dismiss();
  }
}
