import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/compat/firestore';

export type RepeatOption = 'never' | 'day' | 'week' | 'month' | 'year';

export interface ITransaction {
  name: string;
  type: 'expenses' | 'income';
  id?: string;
  amount: number;
  startDate: number;
  repeatInterval: number;
  repeatOption: RepeatOption;
  noOfInstallments: number;
}

@Component({
  selector: 'app-expenses-form',
  templateUrl: './transactions -form.component.html',
  styleUrls: ['./transactions -form.component.scss'],
})
export class TransactionsFormComponent {

  data: ITransaction = {
    name: 'Test 01',
    amount: 1,
    type: 'expenses',
    startDate: window.getServerTime(),
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
  }

  async saveExpenses(expensesForm: NgForm) {
    const loaderId = window.loader.show();
    await this.firestore.collection<ITransaction>('transactions').add({
      ...expensesForm.value,
      noOfInstallments: Number(expensesForm.value.noOfInstallments),
      startDate: expensesForm.value.startDate.getTime()
    });
    await window.loader.hide(loaderId);
    await this.modalController.dismiss();
  }
}
