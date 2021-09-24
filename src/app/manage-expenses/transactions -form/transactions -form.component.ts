import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import * as moment from 'moment';

export type RepeatOption = 'never' | 'day' | 'week' | 'month' | 'year';

export interface ITransaction {
  name: string;
  type: 'expenses' | 'income';
  id?: string;
  amount: number;
  startDate: number | Date;
  endDate: number | Date;
  dates?: { start: number | Date; end: number | Date };
  repeatInterval: number;
  repeatOption: RepeatOption;
  noOfInstallments: number;
}

@Component({
  selector: 'app-expenses-form',
  templateUrl: './transactions -form.component.html',
  styleUrls: ['./transactions -form.component.scss'],
})
export class TransactionsFormComponent implements OnInit {

  @Input() type: 'expenses' | 'income' = 'expenses';
  data: ITransaction = {
    name: 'Test 01',
    amount: 1,
    type: 'expenses',
    startDate: null,
    endDate: null,
    repeatInterval: 2,
    repeatOption: 'month',
    noOfInstallments: 6,
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
  private dialogRef: MatDialogRef<unknown, any>;

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
  }

  updateEndDate(): void {
    setTimeout(() => {
      const date = moment(this.data.startDate);
      /*console.log('Repeat Option', this.data.repeatOption);
      console.log('Repeat Interval', this.data.repeatInterval);
      console.log('Start Date', date.format('DD-MMMM-yyyy'));
      console.log('No of Months', this.data.repeatInterval * this.data.noOfInstallments);*/
      const unit: string = this.modalData.repeatOption;
      const duration: any = this.data.repeatInterval * this.data.noOfInstallments - 1;
      date.add(duration, unit);
      this.data.endDate = date.toDate();
      /*console.log('End Date', date.format('DD-MMMM-yyyy'));
      console.log('-----------------');*/
    }, 50);
  }

  openDialog(template: any): void {
    if (this.oldRepeatOption !== 'never') {
      this.modalData.repeatOption = this.oldRepeatOption;
      this.modalData.repeatInterval = this.data.repeatInterval;
    } else {
      this.data.repeatOption = 'day';
    }
    this.dialogRef = this.dialog.open(template, {width: '400px'});
  }

  getRepeatOptionLabel(option: string, isOpen: boolean) {
    if (isOpen) {
      return `Every ${option}`;
    }
    // eslint-disable-next-line max-len
    return `Every ${(this.data.repeatInterval === 1) ? '' : this.data.repeatInterval} ${option}${(this.data.repeatInterval === 1) ? '' : 's'}`;
  }

  repeatOptionOkClick() {
    this.data.repeatOption = this.modalData.repeatOption;
    this.data.repeatInterval = this.modalData.repeatInterval;
    this.dialogRef.close();
    this.updateEndDate();
  }

  async saveExpenses(expensesForm: NgForm) {
    const loaderId = window.loader.show();
    await this.firestore.collection<ITransaction>('transactions').add({
      ...expensesForm.value,
      dates: {
        start: expensesForm.value.startDate.getTime(),
        end: expensesForm.value.endDate.getTime()
      },
      noOfInstallments: Number(expensesForm.value.noOfInstallments),
      startDate: expensesForm.value.startDate.getTime()
    });
    // moment(transaction.startDate).add(key * transaction.repeatInterval, transaction.repeatOption).format('DD-MMM-yyyy')
    await window.loader.hide(loaderId);
    await this.modalController.dismiss();
  }
}
