import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {IPayment, ITransaction, TransactionService} from '../../shared/transaction-service/transaction.service';
import * as moment from 'moment';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
})
export class TransactionsDetailsComponent implements OnInit {
  @Input() transaction: ITransaction;
  @Input() selectedDate: Date;
  defaultDate: Date;
  dialogRef: MatDialogRef<any>;
  private selectedPayment: IPayment;

  constructor(
    public modalController: ModalController,
    public transactionService: TransactionService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  getFormattedDate(dueDate: number): string {
    return moment(dueDate).format('DD-MMMM-yyyy');
  }

  markAsPaid(markAsPaidTempRef: TemplateRef<any>, payment: IPayment) {
    this.selectedPayment = payment;
    this.defaultDate = new Date(payment.dueDate);
    this.dialogRef = this.dialog.open(markAsPaidTempRef);
  }

  async addPayment(sampleForm: NgForm) {
    // dialogRef
    try {
      await this.transactionService.addPayment(new Date(this.selectedPayment.dueDate), this.transaction.id, sampleForm.value.paidOn);
      this.dialogRef.close();
    } catch (e) {
    }
  }
}
